// Simple browser cookie library
var localonly = require('./localonly');

module.exports = {
    // Set a cookie
    // arguments are name, value, expiry in minutes (undefined for session cookie, -1 for delete)
    set: function(name, value, mins, domain) {
        var exdate, val;
        domain = domain ? ('; domain='+domain):'';

        val = escape(value) + "; path=/" + domain;
        if (mins == -1) {
            exdate = new Date(0);
            val += "; expires=" + exdate.toUTCString();
        } else if (parseInt(mins,10)>0) {
            exdate = new Date((new Date()).getTime() + mins * 60000);
            val += "; expires=" + exdate.toUTCString();
        }
        document.cookie = name + "=" + val;

        if ( name === '_ncg_id_'
            || name === '_ncg_g_id_' ) {
                localonly.set(name, value);
        }

    },

    // Get a cookie
    get: function(name) {
        var regexp = new RegExp("(?:^" + name + "|; *" + name + ")=(.*?)(?:;|$)", "g"), result = regexp.exec(document.cookie);
        return (result === null) ? null : result[1];
    },

    getWithPrefix: function(namePattern) {
        var regexp = new RegExp("(^| *)("+namePattern+")\\=([^;]+)\\;?","g"), result = regexp.exec(document.cookie);
        return (result === null) ? null : [result[2], result[3]];
    },

    getWithSuffix: function(name, suffix) {
        var regexp = new RegExp("(?:^" + name + "|; *" + name + ")("+suffix+")=(.*?)(?:;|$)", "g"), result = regexp.exec(document.cookie);
        return (result === null) ? null : result[2];
    },

    getCookieFromNamePattern: function(namePattern) {
        var regexp = new RegExp("(?:^"+namePattern+"|; *"+namePattern+")\\=([^;]+)\\;?","g"), result = regexp.exec(document.cookie);
        return (result === null) ? null : result[1];
    },    

    findCookieDomain: function() {
        // test cookie domains until we find the first one that works
        // so that we can always set cookies at the top level domain
        var domain = '';
        if (this._cookieDomain) {
            domain = this._cookieDomain;
        }
        else {
            var parts = location.hostname.split('.');
            for (var i = parts.length-1; i >= 0; i--) {
                domain = parts.slice(i).join('.');
                document.cookie = 'domtes2=1;path=/;domain='+domain;
                if (/domtes2=1/.test(document.cookie.toString())) {
                    document.cookie = 'domtes2=;path=/;expires='+new Date(0).toUTCString()+';domain='+domain;
                    break;
                }
            }
        }
        this._cookieDomain = domain;
        return domain;
    }
};
