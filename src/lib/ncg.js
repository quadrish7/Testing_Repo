var scheduler = require('../lib/scheduler')('_ncg_sch_');
var sp = require('../lib/snowplow');
var newsbus = require('../lib/newsbus');
var cookie = require('../lib/cookie');
var debug = require('../lib/debug');
var local = require('../lib/local');
var localonly = require('../lib/localonly');
var extend = require('extend');
var ncgid = require('../lib/ncg_id');
var cookiesync = require('../lib/tags/cookiesync');
var ruleChecker = require('../lib/ruleChecker');
var consent_tag = require('../lib/consenttag');
var ids = require('./ids');
const CookieSetter = require('./tags/cookiesetter');

var ncg = function() {}
ncg.prototype = {

    /* private vars */
    _defer_pageview_triggered: false,
    _pageview_done: false,

    init: function(params) {
        this.params = params;
        /*
         *
         */
        this.config = require('./config')(this.params.domainsConfig);
        this.params.domainConfig = this.domainConfig = this.config.findDomain(document.location.hostname);
        this.is_dnt_site = (this.domainConfig && this.domainConfig.dnt===true);

        window.nb = window.nb || [];
        // make the window nb property a proper event bus
        newsbus(window, 'nb', window);

        /*
         * Init ncg_data
         */
        ncg_data = window.ncg_data || {};
        ncg_data.events = ncg_data.events || [];
        // make the ncg_data events property a proper event bus

        newsbus(ncg_data, 'events', this);
        this.ncg_data = ncg_data;

        var domain_features = {};
        domain_features.anonymous_tracking = this.getAnonymousTrackingStatus();        
        ncg_data.domain_features = domain_features;

        // check for dnt flag in localstorage variable
        if(local.get('_ncg_dnt_') == 1) {
            // whenever a page loads with _ncg_dnt_ = 1, then it should add/track a scheduler with 4hour interval for special cookie sync action
            // Init cookie sync
            this.cookiesync = new cookiesync(this.getTagsParams());
            // Check if CS should run considering DNT state scenario
            if (this.cookiesync.shouldRun()) {
                var self = this;
                this.cookiesync.runDntSync(function(ret) {
                    self.setOptout(ret.optOut);
                    self.dntOptout(ret.optOut, self.is_dnt_site);
                });
            }
            // return
            debug.log('NCG DNT');
            return;
        }
 
        // if user didn't consent, don't load snowplow tag
        // TCF
        if(!consent_tag.consentOk(this.domainConfig.domain)){
            return;
        }

        // Trigger cookie sync if required
        var disabledCookieSetter = ["fnlondon.com","penews.com"];
        this.ncg_data._cookie_sync_enabled = !disabledCookieSetter.filter((value)=>document.location.hostname.endsWith(value)).length;

        if(this.ncg_data._cookie_sync_enabled){
                var reconsented = false;
            if (reconsented ) {
                var currTS = Math.floor((new Date()).getTime() / 1000);
                var expiryTS = currTS + (1*365*24*60*60);
                (new CookieSetter(expiryTS)).run(force=true);
            } else {
                (new CookieSetter()).run();
            }
        }
        var self = this;

        sp.init(this.params.collector, {
            siteId: this.params.siteId
            }, function() {
                self.snowplowReady.apply(self);
        });
    
        this.sp = sp;

        // Country specific init
        this.params.countryConfig.utils.init(this);

        // Do not track
        ncgid.events.push(['optOut',function(pref) {
            debug.log('setting opt out...', pref);
            self.setOptout(pref);
            self.dntOptout(pref, self.is_dnt_site);
        }]);

        window.nb = window.nb || [];
        // make the window nb property a proper event bus
        newsbus(window, 'nb', window);

        // Link tracking
        if (this.ncg_data.link_tracker_selector) {
            if(typeof window.addEventListener === "function"){
                window.addEventListener("load", function () {
                    debug.log("activating link tracking after window load");
                    self.sp.activateLinkTracking({
                        link_tracker_selector: self.ncg_data.link_tracker_selector,
                        link_tracker_watch_selector: self.ncg_data.link_tracker_watch_selector
                    });
                });
            } else {
                var delay = 3000;
                setTimeout(function () {
                    debug.log("activating link tracking after " + delay);
                    self.sp.activateLinkTracking({
                        link_tracker_selector: self.ncg_data.link_tracker_selector,
                        link_tracker_watch_selector: self.ncg_data.link_tracker_watch_selector
                    });
                }, delay);
            }
        }
    },

    snowplowReady: function() {
        // SnowPlow ready
        var userInfo = sp.getUserInfo();

        // Copy the local id to a standalone cookie,
        // so that it can be read from other libraries, without too much hassle

        // Get newsconnect global user id and set it on ncg_data
        if (ncg_data._cookie_sync_enabled) {
            var networkId = new ids.NetworkId(cookie.get('_ncg_g_id_'));
            if (networkId.isValid()) {
                ncg_data.browser_ncg_id = networkId.getId();
            }
        } else {
            var _ncg_g_id_ = cookie.get('_ncg_g_id_');
            if (_ncg_g_id_) {
                ncg_data.browser_ncg_id = _ncg_g_id_;
            }
        }

        // Get the cached logged-in user_id
        // if the user has changed (eg: recently logged in)
        // then cache it and re-schedule cs
        if (this.ncg_data.user_id) {
            var cached_user_id = local.get('_ncg_cached_userid_');
            if (!cached_user_id || cached_user_id != this.ncg_data.user_id) {
                local.set('_ncg_cached_userid_', this.ncg_data.user_id);
                scheduler.remove('cs');
            }
        }
        // Set the _ncg_id_ cookie based on the following rules:
        // - always set to domain id
        // - Otherwise, use the value of Snowplow's first-party cookie, only in a clean readable format
        // Other trackers and libraries can now easily read this id
        ncgid.update({
            domain_id: userInfo.id
        });
        var ruleCheckerObj = new ruleChecker(this.params.gdprEndpoint);
        var self = this;

        // Init cookie sync
        self.cookiesync = new cookiesync(self.getTagsParams());

        //check if GDPR user
        ruleCheckerObj.shouldEnableNcgTracker(this.params.domainConfig, function (err, ret) {
            if (err) {
                console.log(err);
            } else if (ret) {
                // Check if CS should run
                if (self.cookiesync.shouldRun()) {
                    self.pageViewLogic(1000);
                    // first collect optout staus
                    
                    self.cookiesync.runDntSync(function(ret) {
                        self.setOptout(ret.optOut);
                        self.dntOptout(ret.optOut, self.is_dnt_site);
                        if (ret.optOut) {
                            sp.optOut();
                        } else {
                            self.cookiesync.run(function (ret) {
                                debug.log('One cookie sync', ret);
                                // Trigger pageview, just in case it is waiting for us
                                self.triggerPageView({from: 'after-cookiesync'});
                            });
                        }
                    });

                    //TODO add listener to document ready
                    self.cookiesync.run(function (ret) {
                        debug.log('One cookie sync', ret);
                        // Trigger pageview, just in case it is waiting for us
                        self.triggerPageView({from: 'after-cookiesync'});
                    }, function (ret) {
                        debug.log('All cookie sync', ret);
                    }, function (optOut) {
                        debug.log('Opt-out callback', optOut);
                        ncgid.events.push(['optOut', optOut]);
                        if (optOut) {
                            sp.optOut();
                        }
                    });
                }
                else {
                    // Removing the first pageview event. See (****)
                    self.pageViewLogic(0);
                }

                // Load country specific tags
                self.params.countryConfig.tags.load(self.getTagsParams(), self);
            }
        });
 

        // Push public "ready" event
        ncg_data.events.push(['ready']);

        // IAB consent string syncup
        //self.sendIABConsentString();
    },

    getTagsParams: function() {
        // Though AAPI here is a minormer, this utility function is needed
        // for aka link:user to function properly during cookie sync
        if (this.params.countryConfig.utils.aapiExtraIds) {
            this.params.aapiExtraIds = this.params.countryConfig.utils.aapiExtraIds;
        }

        return extend({},this.params,{
            userInfo: sp && Object.keys(sp).length ? sp.getUserInfo() : {},
            ncg_data: ncg_data,
            sp: sp
        });
    },

    pageViewConditions: function() {

    },

    pageViewLogic: function(wait) {
        var self = this;
        if (!ncg_data.defer) {
            // No defer is set, wait for {"wait" miliseconds} to see if the aka link returns
            setTimeout(function() {
                self.triggerPageView({from: 'timeout', wait: wait});
            }, wait);
        }
        else {
            // Attach the pageview to the external "pageview" event
            // NOTE: If "ncg_data.defer=true" then we depend on external devs to actually
            //       trigger the "pageview" event. We have no control now.
            ncg_data.events.push(['pageview', function() {
                self._defer_pageview_triggered = true;
                self.triggerPageView({from: 'pageview'});
            }]);
        }
    },

    triggerPageView: function(data) {
        debug.log('trigger-pv',data);
        if (!this._pageview_done && (!ncg_data.defer || this._defer_pageview_triggered)) {
            this._pageview_done = true;
            debug.log('pv',data);

            // localStorage Page View count
            local.increment('_ncg_pv_');

            extend(ncg_data, {
                'country': this.params.country,
                'countrySchemas': this.params.countryConfig.schemas,
                'gigyaEnabledSites': this.params.domainsConfig.gigyaEnabledSites
            });
            // SnowPlow PageView event
            sp.pageView(ncg_data);
        }
    },

    optOut: function() {
        sp.optOut({});
    },

    optIn: function() {
        sp.optIn({});
    },

    dntOptout: function(dnt, is_dnt_site) {
        if(dnt && is_dnt_site) {
            local.set('_ncg_dnt_', 1);
        } else { // else case may not be required as ncg.js would remove if dnt flag is off ????
            local.unset('_ncg_dnt_');
        }
    },

    setOptout: function(optOut) {
        if(optOut) {
            local.set('_ncg_optout_', 1);
        } else { // else case may not be required as ncg.js would remove if dnt flag is off ????
            local.unset('_ncg_optout_');
        }
    },

    checkOptOutStatus: function(callback) {
        this.getAllMatchidsUsingCookieSyncAndAAPI(function(matchids) {
            if (Object.keys(matchids).length > 0) {
                var found = false;
                for (var matchid_i in matchids) {
                    var matchid = matchids[matchid_i];
                    if (matchid.preferences && Array.isArray(matchid.preferences)) {
                        matchid.preferences.forEach(function(pref) {
                            if (pref.name == 'opt-out') {
                                found = pref.value;
                                return;
                            }
                        });
                    }
                }
                callback(found);
            }
            else {
                callback(false);
            }
        });
    },

    getPreference: function(name, forceRefresh) {
        return ncgid.getPreference(name);
    },

    getAllMatchids: function(callback) {
        if (ncgid.getMatchid()) {
            callback([ncgid.getMatchid()]);
        }
        else {
            this.getAllMatchidsUsingCookieSyncAndAAPI(function(matchids) {
                callback(Object.keys(matchids));
            });
        }
    },

    getAllMatchidsUsingCookieSyncAndAAPI: function(callback) {
        if (this.__cached_getAllMatchidsUsingCookieSyncAndAAPI) {
            callback(this.__cached_getAllMatchidsUsingCookieSyncAndAAPI);
            return;
        }
        var self = this;
        var aapiObj = new aapi(this.getTagsParams());
        this.cookiesync.run(function(ret) {
            // Wait for all to complete
        }, function(retAll) {
            debug.log('OO ALL CS', retAll);
            var checkRets = [];
            for (var i=0; i<retAll.length; i++) {
                var ret = retAll[i];
                if (ret.aka) {
                    checkRets.push(ret);
                }
            }
            var allChecked = 0;
            var matchids = {};
            if (checkRets.length == 0) {
                callback([]);
            }
            else {
                for (var i=0; i<checkRets.length; i++) {
                    var ret = checkRets[i];
                    aapiObj.lookup([{
                        type: 'domain',
                        site: ret.domain,
                        value: ret.aka
                    }], function(err, ret2) {
                        allChecked++;
                        if (ret2 && ret2.matchid) {
                            matchids[ret2.matchid] = ret2;
                        }
                        if (allChecked == checkRets.length) {
                            self.__cached_getAllMatchidsUsingCookieSyncAndAAPI = matchids;
                            callback(matchids);
                        }
                    });
                }
            }
        });
    },

    sendIABConsentString: function() {
        // TODO: remove hardcoded domain and cookie names
        var UK_DOMAINS = ['.thetimes.co.uk', '.thesun.co.uk'];
        var IAB_CONSENT_COOKIE_NAME = 'eupubconsent';

        if( document.location.hostname.endsWith(UK_DOMAINS[0])
            || document.location.hostname.endsWith(UK_DOMAINS[1]) ) {

                var cookieValue = cookie.get(IAB_CONSENT_COOKIE_NAME);
                var localStorageValue = localonly.get(IAB_CONSENT_COOKIE_NAME);

                if (cookieValue !== null 
                    && (localStorageValue === null || localStorageValue !== cookieValue) ) {
                        localonly.set(IAB_CONSENT_COOKIE_NAME, cookieValue);
                        sp.sendIABConsentString(cookieValue);
                }

        }
    },

    getAnonymousTrackingStatus : function(){ 
        return !!cookie.get('_ncg_g_id_');
    },
}

module.exports = ncg;
