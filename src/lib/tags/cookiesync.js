var cookie = require('../cookie');
var local = require('../local');
var scheduler = require('../scheduler')('_ncg_sch_');
var extend = require('extend');
var debug = require('../debug');
var userAgent = require('../userAgent');
var ids = require('../ids');

var CookieSync = function(params) {
    this.params = params;
    this.init();
}

CookieSync.prototype = {

    id: 'cs',
    notFirstPageView: false,
    ifrms: {},

    init: function() {
        var self = this;
        window.addEventListener("message", function() {
            self.receiveMessage.apply(self, arguments);
        }, false);
    },

    shouldRun: function() {
        var isDntState = local.get('_ncg_dnt_') == 1;
        this.notFirstPageView = isDntState || this.params.userInfo.lastSessionTs > this.params.userInfo.firstSessionTs;
        var isBot = userAgent.isBot();
        var cookieScheduler = scheduler.checkOrSchedule(this.id, this.params.cookieSyncScheduleTime);
        var schedulerCheck = !this.notFirstPageView || cookieScheduler;
        var disable = ncg_data.debug_disable_cookiesync;
        debug.log("should sync:", isDntState, this.params.userInfo.lastSessionTs > this.params.userInfo.firstSessionTs, !isBot, !disable, schedulerCheck);
        return !isBot && !disable && schedulerCheck; //notFirstPageView && //DATA-3384
    },

    run: function(callback, callbackAll, optOutCallback) {
        var self = this;
        scheduler.update(this.id);
        // Sync all extra ids, eg: pcsid, gigya, eyeota, userid, etc...
        var extra_ids = null;
        if (this.params.countryConfig.utils.aapiExtraIds) {
            extra_ids = this.params.countryConfig.utils.aapiExtraIds.apply(this.params);
            extra_ids.forEach(function(id) {
                self.params.sp.akaLink(id.type, id.site, id.value);
            });
        }
        // Do a dummy sync with myself. This will force a matchid, and a touch event
        self.params.sp.akaLink('domain', cookie.findCookieDomain(), this.params.userInfo.id);
        // Actual cookie sync
        if (!this.params.domainConfig) 
            return;
        
        if (ncg_data._cookie_sync_enabled) {
            this.newCookieSync(self, extra_ids, callback, callbackAll, optOutCallback);
        } else {
            this.oldCookieSync(self, extra_ids, callback, callbackAll, optOutCallback);
        }
    },

    newCookieSync: function(self, extra_ids, callback, callbackAll, optOutCallback) {
        var networkId = new ids.NetworkId(cookie.get('_ncg_g_id_'));
        if (networkId.isValid()) {
            ncg_data.browser_ncg_id = networkId.getId();
            self.params.sp.akaLink('network', '', networkId.getId());
            return;
        }
        // _nccg_g_id_ cookie does not exist/set initiate domain id syncc logic
        var domains = extend([],this.params.domainConfig.domainsInGroup);
        var optOutDomain = this.params.domainConfig.optOutDomain;
        // first id is always newscgp.com domain, just ignore
        delete(domains[0]);
        var otherDomains = domains;

        var onOtherCookie = function(domain, ret) {
            debug.log('other-cookie-sync-ret',domain, ret);
            if (ret.aka) {
                self.params.sp.akaLink('domain', domain, ret.aka);
            }
            if (ret.isOptOut && typeof ret.optOut !== 'undefined') {
                optOutCallback(ret.optOut)
            }
            if (callback) {
                callback(ret);
            }
        };

        // case: FirstPageView, publish a message for aapi scheduler
        if(!self.notFirstPageView) {
            window.nb.push(['ncg:first-view-ready',{
                "link:domain": true,
                "link:network": networkId.isValid(),
                "link:extra_ids" : !!extra_ids
            }]);
        }

        self.sync(otherDomains, {
            basePath: self.params.cookieSyncPath,
            onCookie: onOtherCookie,
            onAllCookies: callbackAll
        });
    },

    // cookie sync on sites where cookie extension logic is not rolled out
    oldCookieSync: function(self, extra_ids, callback, callbackAll, optOutCallback) {
        var domains = extend([],this.params.domainConfig.domainsInGroup);
        var optOutDomain = this.params.domainConfig.optOutDomain;
        var globalD = [domains[0]];
        delete(domains[0]);
        var otherDomains = [];
        var onGlobalCookie = function(domain, ret) {
            debug.log('global-cookie-sync-ret',domain, ret);
            if (ret.aka) {
                // 3rd party cookies supported
                // Set global id
                cookie.set('_ncg_g_id_', ret.aka, 60*24*365*2, cookie.findCookieDomain());
                // Set ncg_data
                ncg_data.browser_ncg_id = ret.aka;
                self.params.sp.akaLink('network', '', ret.aka);
                // Check opt-out cookie
                if (ret.isOptOut) {
                    if (typeof ret.optOut !== 'undefined') {
                        optOutCallback(ret.optOut);
                    }
                }
                else if (!ret.isOptOut && optOutDomain) {
                    otherDomains = [optOutDomain];
                }
            }
            else {
                otherDomains = domains;
            }
            if (callback) {
                callback(ret);
            }
            if (otherDomains.length) {
                // 3rd party cookies not supported
                // try all other domains
                var onOtherCookie = function(domain, ret) {
                    debug.log('other-cookie-sync-ret',domain, ret);
                    if (ret.aka) {
                        self.params.sp.akaLink('domain', domain, ret.aka);
                    }
                    if (ret.isOptOut && typeof ret.optOut !== 'undefined') {
                        optOutCallback(ret.optOut)
                    }
                    if (callback) {
                        callback(ret);
                    }
                };
                self.sync(otherDomains, {
                    basePath: self.params.cookieSyncPath,
                    onCookie: onOtherCookie,
                    onAllCookies: callbackAll
                }); 
            }
            else {
                callbackAll([ret]);
            }
            // case: FirstPageView, publish a message for aapi scheduler
            if(!self.notFirstPageView) {
                window.nb.push(['ncg:first-view-ready',{
                    "link:domain": true,
                    "link:network": !!ret.aka,
                    "link:extra_ids" : !!extra_ids
                }]);
            }
        };
        var onOptOutCookie = function(status) {
            console.log('Opt out cookie...', status);
            if (optOutCallback) {
                optOutCallback(status);
            }
        };
        this.sync(globalD, {
            basePath: this.params.cookieSyncPath,
            onCookie: onGlobalCookie
        });
    },

    runDntSync: function(callback) {
        var self = this;
        scheduler.update(this.id);
        // dnt state cookie sync - happens ONLY for domains with isOptOut = true
        if (this.params.domainConfig) {
            var domains = extend([],this.params.domainConfig.domainsInGroup);
            var optOutDomain = [];
            for (var d=0; d<domains.length; d++) {
                if(domains[d].isOptOut===true) {
                    optOutDomain.push(domains[d]);
                    break;
                }
            }
            // cookie sync callback
            var onDntGlobalCookieSync = function(domain, ret) {
                debug.log('global-dnt-cookie-sync-ret',domain, ret);
                callback(ret);
            };

            // trigger cookie sync flow
            if(optOutDomain.length) {
                this.sync(optOutDomain, {
                    basePath: this.params.cookieSyncPath,
                    onCookie: onDntGlobalCookieSync
                });
            }
        }
    },

    ssl: function() {
        return ('https:' === document.location.protocol);
    },

    createIframe: function(url, callback) {
        var self = this;
        var protocol = (self.ssl()) ? 'https:' : 'http:';
        if (!this.ifrms[url]) {
            var ifr = document.createElement('iframe');
            var id = 'ncg_cookie_'+parseInt(Math.random()*100000)+'-'+(new Date()).getTime();
            ifr.setAttribute('width',0);
            ifr.setAttribute('height',0);
            ifr.setAttribute('frameborder',0);
            ifr.setAttribute('aria-hidden',true);
            ifr.setAttribute('title','News ID');
            ifr.setAttribute('id',id);
            var body = document.body || document.getElementsByTagName('body')[0];
            ifr.src = url;
            // ifr.width = 0;
            // ifr.height = 0;
            ifr.onload = function() {
                var target = ifr.contentWindow;
                target.postMessage("getcookie:"+id, protocol + url);
            }
            if(body){
                body.appendChild(ifr);
            } else {
                debug.log("cookiesync.createIframe body is: " + body);
            }
            this.ifrms[url] = ifr;
        }
        else {
            var target = this.ifrms[url].contentWindow
            target.postMessage("getcookie:"+this.ifrms[url].getAttribute('id'), protocol + url);
        }
    },

    receiveMessage: function(event)
    {
        if (event.data && event.data.toString().indexOf('cookie:') == 0) {
            try {
                var payload = JSON.parse(event.data.substr('cookie:'.length));
                debug.log("sync domain", payload.domain);
                debug.log("sync payload", payload);
                this.onCookie(payload.domain,payload);
            }
            catch (e) {
                debug.log("sync error", e);
            }
        }
    },

    sync: function(domains, conf) {
        // Get all the valid domain to check
        var domainsToCheck = [];
        for (var d=0; d<domains.length; d++) {
            var domain = domains[d];
            // - Ignore own domain except if its marked as "network"
            //      (allows news.com.au nk sync for example)
            //      @todo: this can be optimized to just return the cookie
            // - Make sure we don't match longer domains containing the domain we're testing,
            //      eg: longtest.com != test.com
            // - Make sure we don't try to call non-https domains from an https domain
            //      (this generates a security error in the browser)
            if (domain) {
                var cookieDomain = '.'+cookie.findCookieDomain();
                debug.log("cookieDomain:", cookieDomain);
                if ((domain.network || domain.url.indexOf(cookieDomain) < 0 || domain.url.indexOf(cookieDomain) !== domain.url.length - cookieDomain.length) && (!this.ssl() || domain.ssl)) {
                    debug.log("adding to domainsToCheck:", domain);
                    domainsToCheck.push(domain);
                }
            }
        }
        // Configure callbacks
        // Poor man's Promise.all equivalent
        var domainsDone = domainsToCheck.length;
        var payloads = [];

        if (conf.onCookie) {
            debug.log("has conf.onCookie");
            this.onCookie = function(domain, payload) {
                debug.log("oncookie done: ", domain, payload);
                conf.onCookie(domain, payload);
                payloads.push(payload);
                if (conf.onAllCookies && payloads.length == domainsToCheck.length) {
                    conf.onAllCookies(payloads);
                }
            }
        }
        if(domainsToCheck.length > 0 ) {
            // Do the actual sync
            for (var d in domainsToCheck) {
                var domain = domainsToCheck[d];
                this.createIframe( '//' + domain.url + conf.basePath + '/cookie.html');
            }
        } else {
            if (conf.onAllCookies) {
                conf.onAllCookies([]);
            }
        }
    }
}

module.exports = CookieSync;