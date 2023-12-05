var config = require('../../../../config/config-us.json');
module.exports = {
    config: config,
    
    // "input" value use cases in code 
        // input-use-case-1: document.location.hostname = "www.wsj.com" during tracking site interactions
        // input-use-case-2: event.origin.split... = "www.wsj.com" during parent -> iframe communication

    // check that a website exists in the tracking/participating sites list    
    spec1: {
        input: "www.wsj.com", 
        output: {
            domain: "wsj.com",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][1],
            dnt: true,
            excludePixels: [],
            gdprCheckEnabled: false,
            generateNewsKey: false
            //isOptOut: undefined
        }
    },
    spec2: {
        input: "ncaudienceexchange.com",
        output: {            
            domain: "ncaudienceexchange.com",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][1],
            dnt: true,
            excludePixels: [],
            gdprCheckEnabled: false,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },

    // check that a website exists in the tracking/participating sites list with different configuration parameters
    spec3: {
        input: "newscgp.com",
        output: {            
            domain: "newscgp.com",
            group: "1",
            cookieName: "sp",
            isSnowplowCookie: false,
            envs: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][1],
            dnt: true,
            excludePixels: [],
            gdprCheckEnabled: false,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },
    spec4: {
        input: "us.tags.newscgp.com",
        output: {            
            domain: "newscgp.com",
            group: "1",
            cookieName: "sp",
            isSnowplowCookie: false,
            envs: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][1],
            dnt: true,
            excludePixels: [],
            gdprCheckEnabled: false,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },

    // check for website that does not exist in the sites list must return false
    spec5: {
        input: "invalidsite.unknown.com",
        output: false
    },

    spec6: {
        input: "www.thescottishsun.co.uk", 
        output: {
            domain: "thescottishsun.co.uk",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][1],
            dnt: true,
            excludePixels: [],
            gdprCheckEnabled: false,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },

    spec7: {
        input: "www.thesun.ie", 
        output: {
            domain: "thesun.ie",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][1],
            dnt: true,
            excludePixels: [],
            gdprCheckEnabled: false,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },

    spec8: {
        input: "www.talksport.com", 
        output: {
            domain: "talksport.com",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][1],
            dnt: true,
            excludePixels: [],
            gdprCheckEnabled: false,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },
}