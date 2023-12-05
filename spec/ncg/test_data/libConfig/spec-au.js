var config = require('../../../../config/config-au.json');
module.exports = {
    config: config,
    
    // "input" value use cases in code 
        // input-use-case-1: document.location.hostname = "www.wsj.com" during tracking site interactions
        // input-use-case-2: event.origin.split... = "www.wsj.com" during parent -> iframe communication

    // check that a website exists in the tracking/participating sites list    
    spec1: {
        input: "www.theaustralian.com.au", 
        output: {
            domain: "theaustralian.com.au",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: ["sit","uat"],
            dnt: false,
            excludePixels: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][0],
            gdprCheckEnabled: true,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },

    // check that a website exists in the tracking/participating sites list with different configuration parameters
    spec2: {
        input: "www.news.com.au", 
        output: {
            domain: "news.com.au",
            group: "1",
            cookieName: "nk",
            isSnowplowCookie: false,
            envs: ["sit","uat"],
            dnt: false,
            excludePixels: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][0],
            gdprCheckEnabled: true,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },
    spec3: {
        input: "ncg.tags.news.com.au", 
        output: {
            domain: "news.com.au",
            group: "1",
            cookieName: "nk",
            isSnowplowCookie: false,
            envs: ["sit","uat"],
            dnt: false,
            excludePixels: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][0],
            isOptOut: true,
            gdprCheckEnabled: true,
            generateNewsKey: false,
        }
    },
    

    // check for website that does not exist in the sites list must return false
    spec4: {
        input: "au.tags.newscgp.com",
        output: false
    },
    spec5: {
        input: "invalidsite.unknown.com",
        output: false
    },

    spec6: {
        input: "www.southaustralia.com", 
        output: {
            domain: "southaustralia.com",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: ["sit","uat"],
            dnt: false,
            excludePixels: ["eyeota"],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][0],
            gdprCheckEnabled: true,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },

    spec7: {
        input: "uat.sc.southaustralia.com", 
        output: {
            domain: "southaustralia.com",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: ["sit","uat"],
            dnt: false,
            excludePixels: ["eyeota"],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][0],
            gdprCheckEnabled: true,
            generateNewsKey: false,
            //isOptOut: undefined
        }
    },

    spec8: {
        input: "cruises.helloworld.com.au", 
        output: {
            domain: "helloworld.com.au",
            group: "1",
            cookieName: "_ncg_sp_",
            isSnowplowCookie: true,
            envs: ["sit","uat"],
            dnt: false,
            excludePixels: [],
            domainsInGroup: config.groups["1"],
            optOutDomain: config.groups["1"][0],
            gdprCheckEnabled: true,
            generateNewsKey: true,
            //isOptOut: undefined
        }
    }
}