// Local Storage library with fallback to first party cookies
var cookie = require('./cookie');

var local = function() {
};

local.prototype = {

    storage: localStorage,
    cookieTime: 10 * 365 * 24 * 60,

    session: function() {
        var ret = new local();
        ret.storage = sessionStorage;
        ret.cookieTime = null;
        return ret;
    },

    set: function(name, value) {
        // Safari will throw a "Quota Exceeded" exception while in Private Browsing
        try {
            return this.storage.setItem(name, value);
        } catch(e) {
            return cookie.set(name, value, this.cookieTime);
        }
    },

    get: function(name) {
        // Safari will not throw any exception while in Private Browsing,
        // so we still need to check the cookie anyway
        var ret = '';
        try {
            ret = this.storage.getItem(name);
        } catch(e) {}
        if (!ret) {
            ret = cookie.get(name) || '';
        }
        return ret;
    },

    unset: function(name) {
        try {
            return this.storage.removeItem(name);
        } catch(e) {
            return cookie.set(name, value, -1);
        }
    },

    increment: function(name) {
        var count = this.get(name) || 0;
        this.set(name, parseInt(count)+1);
    },

    // Utility function to flatten an object into an array
    // eg.  {a: {b: 1}} -> [{k: 'a.b', v: 1}]
    flatten: function flatten(obj, prefix) {
        var res = [], r, z = 0, sep='.';
        if (prefix != '') prefix += sep;
        for ( var i in obj) {
            if (Object.prototype.toString.call(obj[i]) === '[object Array]') {
                res.push({
                    "k" : prefix + i,
                    "v" : obj[i].join(',')
                });
            } else if (typeof (obj[i]) === 'object') {
                r = flatten(obj[i], prefix + i);
                for (z = 0; z < r.length; z++) {
                    res.push(r[z]);
                }
            } else {
                res.push({
                    "k" : prefix + i,
                    "v" : obj[i]
                });
            }
        }
        return res;
    }
};

module.exports = new local();