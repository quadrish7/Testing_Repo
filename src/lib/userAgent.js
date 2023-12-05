module.exports = {

    isBot: function() {
        var ua = navigator.userAgent.toLowerCase(), bots = [ "bot", "crawl", "spider", "spyder", "khte", "ktxn", "keynote", "gomezagent", "alertsite", "pingdom", "yottamonitor",
            "yottaamonitor", "yahoo", "slurp", "scrape", "agentname", "aport", "avantgo", "backweb", "bimbo", "bordermanager", "bumblebee", "ce-preload", "changedetection", 
            "charlotte", "crescent", "dialer", "download ninja", "dts agent", "enews creator", "fetch", "firehunter", "frontier", "getright", "go!zilla", "golem", "harvest", 
            "httrack", "indy library", "infolink", "internet ninja", "justview", "kilroy", "larbin", "libwww-perl", "linkchecker", "lwp", "macreport", "microsoft url control",
            "mobipocket webcompanion", "monitor", "monster", "mozilla/5.0 (compatible; msie 5.0)", "ms frontpage", "ms search", "msnptc", "nomad", "patric", "perman surfer", 
            "pioneer", "powermarks", "rpt-http", "spike", "stuff", "sucker", "taz", "teleport", "templeton", "thunderstone", "t-h-u-n-d-e-r-s-t-o-n-e", "voyager", "web downloader", 
            "webauto", "webcapture", "webcopier", "webdup", "webinator", "website extractor", "webtool", "webzip", "wget", "worm", "freedom", "yahoofeedseeker", "internal zero-knowledge agent", 
            "liferea", "findlinks", "mackster", "automapit", "advanced email extractor", "news reader", "feedfetcher", "http-webtest", "forex trading network organization", "newstin", 
            "panscient.com", "snoopy", "n-central", "globrix", "aol_cap", "pagebull", "universalsearch", "hoopla", "maxamine", "argus", "google wireless transcoder", "jobrapido", 
            "webnews arianna", "python-urllib", "litefinder", "isearch", "pricerunner", "system center operations manager", "nettraffic sensor", "nettraffic+sensor", "d1garabicengine", 
            "joedog", "websitepulse", "bitvouseragent", "mozilla/4.0 (compatible; msie 6.0; windows nt 5.1;1813)", "swish-e", "contentsmartz", "quintura-crw", "paros", "msnrv", "kalooga", 
            "watchmouse", "pureload", "proximic", "powerset", "yahoo-richabstracts", "scoutjet", "twiceler", "twingly", "attributor", "europarchive", "search-engine-studio", "yanga", 
            "webmetrics", "irc search", "irc+search", "vivisimo", "onkosh", "holmes", "sphere scout", "sphere+scout", "simplepie", "drupal", "htmlparser", "watchfire webxm", "daumoa",
            "lucidmedia clicksense", "nielsen adr", "evrinid", "fdm 3.x", "webgrab", "isense", "business-semantics", "trovit", "riverglassscanner", "siteimprove", "ruby", "apache-httpclient", 
            "sitealarm", "archive.org", "facebookexternalhit", "flipboardproxy", "google web preview", "evidon", "google-ads-backdrop-testing" ];

        if (ua === null || ua === "") {   
            return true;
        }

        for (var i=0; i < bots.length; i++) {
            var bot = bots[i];
            if (ua.indexOf(bot) !== -1) {
                return true;
            }
        }

        return false;
    },

    ssl: function() {
        return ('https:' === document.location.protocol);
    }
};

