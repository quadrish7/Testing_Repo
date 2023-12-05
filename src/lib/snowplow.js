var cookie = require('./cookie');
var local = require('./local');
var debug = require('../lib/debug');
var contexts = require('./contexts');
var ids = require('./ids');

// string trim polifill
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

var sp = function() {}

sp.prototype = {

    sp_namespace_base: '_ncg_',

    trackedLinks: [],

    init: function(collector, params, ready) {
        debug.log("Initing sp");
        var self = this;
        window.GlobalSnowplowNamespace = window.GlobalSnowplowNamespace || [];
        window.GlobalSnowplowNamespace.push('_ncg_snowplow');
        window._ncg_snowplow = function() {
            debug.log("called window._ncg_snowplow", arguments);
            debug.log("window._ncg_snowplow.q", window._ncg_snowplow.q);
            (window._ncg_snowplow.q = window._ncg_snowplow.q || []).push(arguments)
        };
        var collectors = collector.split('|');
        self.sp_namespace = [];
        for (var ci=0; ci<collectors.length; ci++) {
            var cname = self.sp_namespace_base + '_' + ci;
            self.sp_namespace.push(cname);
            var config = { 
                appId: params.siteId,
                discoverRootDomain: true,
                cookieName: "_ncg_sp_",
                extraInfo: this.getExtraInfo(),
                cookieSecure: true,
            };
            
            if(ncg_data.domain_features.anonymous_tracking){
                config.eventMethod = 'post';
                config.anonymousTracking = {withServerAnonymisation:true,withSessionTracking:true};
            } else{
                config.eventMethod = 'get';
                config.anonymousTracking = false;
            }
            
            window._ncg_snowplow('newTracker', cname, collectors[ci], config); // Initialise a tracker
            // See if prerender flag is affecting pixel counts
            // window._ncg_snowplow('setCountPreRendered:'+this.sp_namespace.join(';'), true);
            // Clean broken urls...
            // This is to overcome a known issue with the snowplow collector
            // https://github.com/snowplow/snowplow/issues/2893
            if (window.location.href.indexOf('#')>=0) {
                var fixed = self.checkForInvalidUrlAndClean(window.location.href);
                if (fixed) {
                    window._ncg_snowplow('setCustomUrl:'+this.sp_namespace.join(';'), fixed);
                }
            }
        }
        debug.log("finish setup collectors");
        window._ncg_snowplow(function() {
            self.sp = this[self.sp_namespace[0]];
            // Only apply the ready function to the first tracker
            debug.log("apply snowplow ready function", (typeof ready == 'function'));
            if (ready && typeof ready == 'function') {
                ready.apply(this[self.sp_namespace]);
            }
        });
    },

    /*
     * Fixes urls like:
     *  http://supercoach.dailytelegraph.com.au/nrl/tipping/lobby##panel-body-steps
     *  http://www.dailytelegraph.com.au/news/nsw/man-and-shark-hows-this-for-clickbait/news-story/c3ec6f524b7c4fa091cd441cdf2568f6#itm=newscomau%7Chome%7Cnca-homepage-topstories%7C5%7Clink%7Chomepage%7Chomepage&itmt=1501710643552#itm=newscomau%7Chome%7Cnca-homepage-topstories%7C5%7Clink%7Chomepage%7Chomepage&itmt=1501710650904
     * When a URL has more than one hash, it will escape all but the first
     * @see: https://github.com/snowplow/snowplow/issues/2893
     */
    checkForInvalidUrlAndClean: function(url) {
        var matches = url.match(/#/g);
        if (matches && matches.length>1) {
            return url.split('#').slice(0,1).join('') + '#' + url.split('#').slice(1).join('%23');
        }
        return false;
    },

    guessDefaults: function(params) {
        // dmp data
        if (!params.browser_dmp_id && !params.browser_dmp_provider) {
            // See if we can get a permutiveid from the standard places
            var permutiveid = cookie.get("permutive-id");   
            if(permutiveid){
                params.browser_dmp_provider = 'permutive';
                params.browser_dmp_id = permutiveid;
            }
        }
        return params;
    },

    pageView: function(params) {  
        var self = this;   
        if (params.match_id) {
            self.userId(params.match_id);
        }
        params = self.guessDefaults(params);
        var schemas = [];
        
        schemas = contexts.getContext(params);
        debug.log('got schemas from context as ', schemas);
    
        var sendSchemas = [];
        for (var i=0; i<schemas.length; i++) {
            if (schemas[i]) {
                sendSchemas.push(schemas[i]);
            }
        }
        debug.log('Schemas',sendSchemas);
        window._ncg_snowplow('trackPageView:'+self.sp_namespace.join(';'),{
            title : 'Page-View',
            context : sendSchemas
        });
        if (params.user_extra_ids) {
            params.user_extra_ids.forEach(function(extra) {
                self.akaLink('provider', extra.provider, extra.id);
            });
        }
    },

    /*
     * Set a user id by prefixing the provider and the id
     *
     */
    userId: function(value) {
        // window._ncg_snowplow('setUserId:'+this.sp_namespace.join(';'), value);
        window._ncg_snowplow('setUserId:'+this.sp_namespace[0], value);
    },

    /*
     * type: domain | provider
     * value: site.com | krux | 
     * id: third party cookie value
     */
    akaLink: function(type, value, id) {
        //     'trackStructEvent', 'category', 'action', 'label',               'property', 'value'
        // eg: 'trackStructEvent', 'Mixes',    'Play',   'MrC/fabric-0503-mix', '',         '0.0'
        // window._ncg_snowplow('trackStructEvent:'+this.sp_namespace.join(';'), 'aka','link:'+type, id, value);
        window._ncg_snowplow('trackStructEvent:'+this.sp_namespace[0], {
            category :'aka',
            action :'link:'+type,
            label : id, 
            property : value
        });
    },

    optOut: function(params) {
        // window._ncg_snowplow('trackStructEvent:'+this.sp_namespace.join(';'), 'preferences','opt-out','','',1);
        // window._ncg_snowplow('trackStructEvent:'+this.sp_namespace[0], 'preferences','opt-out','','',1);
        window._ncg_snowplow('trackStructEvent:'+this.sp_namespace[0], {
            category :'preferences',
            action :'opt-out',
            label : '', 
            property : 1
        });

    },

    optIn: function(params) {
        // window._ncg_snowplow('trackStructEvent:'+this.sp_namespace.join(';'), 'preferences','opt-out','','',0);
        // window._ncg_snowplow('trackStructEvent:'+this.sp_namespace[0], 'preferences','opt-out','','',0);
        window._ncg_snowplow('trackStructEvent:'+this.sp_namespace[0], {
            category :'preferences',
            action :'opt-out',
            label : '', 
            property : 0
        });
    },

    // TODO: delete completely
    // this function is used ONLY by disabled src/lib/tags/dfp.js
    sendPreference: function (params) {
        var self = this;   
        if (params.match_id) {
            self.userId(params.match_id);
        }
        // window._ncg_snowplow(
        //     'trackStructEvent:'+this.sp_namespace.join(';'),
        //     'preferences',
        //     params.preferenceEventName,
        //     '',
        //     '',
        //     params.preferenceEventValue
        // );

        // window._ncg_snowplow(
        //     'trackStructEvent:'+this.sp_namespace[0],
        //     'preferences',
        //     params.preferenceEventName,
        //     '',
        //     '',
        //     params.preferenceEventValue
        // );

        window._ncg_snowplow('trackStructEvent:'+this.sp_namespace[0], {
            category :'preferences',
            action : params.preferenceEventName,
            label : '', 
            property : params.preferenceEventValue
        });
    },

    sendIABConsentString: function( consentString ) {
        // window._ncg_snowplow('trackStructEvent:'+this.sp_namespace.join(';'), 'preferences','IAB_CS',consentString);
        // window._ncg_snowplow('trackStructEvent:'+this.sp_namespace[0], 'preferences','IAB_CS',consentString);
        window._ncg_snowplow('trackStructEvent:'+this.sp_namespace[0], {
            category :'preferences',
            action : 'IAB_CS',
            label : '', 
            property : consentString
        });
    },

    extractFilterLinks: function (element, link_tracker_selector) {
        var self = this;
        var tracked = element.querySelectorAll(link_tracker_selector);
        debug.log("Find links for " + link_tracker_selector + "," + tracked.length + ", already tracked links: " + self.trackedLinks);
        if (!self.trackedLinks) {
            self.trackedLinks = [];
        }
        for (var i = 0; i < tracked.length; i++) {
            var val = tracked[i].href;
            if (self.trackedLinks.indexOf(val) < 0) {
                self.trackedLinks.push(val);
            }
        }
        debug.log("Tracked links: " + self.trackedLinks);
    },

    activateLinkTracking: function(params) {
        var self = this;
        if(params.link_tracker_watch_selector && document.querySelectorAll(params.link_tracker_watch_selector)){
            var watchedElements = document.querySelectorAll(params.link_tracker_watch_selector);
            debug.log("Watched elements for " + params.link_tracker_watch_selector + ", " + watchedElements.length);
            for (var i = 0; i < watchedElements.length; i++) {
                var observedElement = watchedElements[i];
                self.extractFilterLinks(observedElement, params.link_tracker_selector);
                if (observedElement.tagName.toUpperCase() !== "BODY") {
                    if(window["MutationObserver"]){
                        if(!self.observers){
                            self.observers = [];
                        }
                        var observer = new MutationObserver(function (mutations) {
                            var updatedWatchElements = document.querySelectorAll(params.link_tracker_watch_selector);
                            debug.log("Refreshing link tracking updatedWatchElements: " + updatedWatchElements.length + ",mutation:" + mutations);
                            for (var j = 0; j < updatedWatchElements.length; j++) {
                                var updatedObserveElement = updatedWatchElements[j];
                                self.extractFilterLinks(updatedObserveElement, params.link_tracker_selector);
                                window._ncg_snowplow('refreshLinkClickTracking:'+self.sp_namespace.join(';'));
                            }
                        });
                        observer.observe(observedElement, {childList: true, subtree: true});
                        self.observers.push(observer);
                        debug.log("Number of link tracker observers: " + self.observers.length);
                    }
                } else {
                    debug.log("BODY tag will not be observed because it may have too many mutations")
                }
            }
        } else {
            self.extractFilterLinks(document, params.link_tracker_selector);
        }

        var linkFilter = function(linkElement) {
            var willTrack = self.trackedLinks && (self.trackedLinks.indexOf(linkElement.href) > -1);
            debug.log("linkFilter:"+linkElement.href+", " + willTrack);
            return willTrack;
        };
        window._ncg_snowplow('enableLinkClickTracking:'+this.sp_namespace.join(';'), {'filter':linkFilter});

    },

    /*
     *   A string set to '1' if this is the user's first session and '0' otherwise
     *   The domain user ID
     *   The timestamp at which the cookie was created
     *   The number of times the user has visited the site
     *   The timestamp for the current visit
     *   The timestamp of the last visit
     */
    getUserInfo: function() {
        var tmpUserInfo = this.sp.getDomainUserInfo();
        var userInfo = {
            firstSession: tmpUserInfo[0],
            id: tmpUserInfo[1],
            cookieTs: tmpUserInfo[2],
            sessions: tmpUserInfo[3],
            lastSessionTs: tmpUserInfo[4],
            firstSessionTs: tmpUserInfo[5]
        };
        return userInfo;
    },

    getExtraInfo: function() {
        var info = {};
        var ncg_g_id = cookie.get("_ncg_g_id_");
        var networkId = new ids.NetworkId(ncg_g_id);
        if (networkId.isValid()) {
            // set nuID to be used by Snowplow
            info['nuId'] = networkId.getId();
            // context with _ncg_g_id_ cookie value (called device id in the system)
            info['extraContexts'] = [
                {
                    schema: 'iglu:com.newscgp/adhoc/jsonschema/1-0-0',
                    data: {
                        namespace: 'newsid.deviceid',  
                        data: [ { key: 'device_id', value: ncg_g_id } ]
                    } 
                }
            ];
        }
        var domainId = new ids.DomainId(cookie.get("_ncg_domain_id_"));
        if (domainId.isValid()) {
            // overrides _ncg_sp._id.id with _ncg_domain_id_.id
            info['domainId'] = domainId.getId();
        }
        return info;
    },

    getDeviceId: function() {
        return cookie.get('_ncg_g_id_');
    },

}

module.exports = new sp();
