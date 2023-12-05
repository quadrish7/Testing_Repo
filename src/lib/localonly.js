// Local Storage library with no fallback to 
//  a) first party cookies, or
//  b) session storage

var localonly = function() {
};

localonly.prototype = {

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
        } catch(e) {}
    },

    get: function(name) {
        // Safari will not throw any exception while in Private Browsing,
        // so we still need to check the cookie anyway
        try {
            return this.storage.getItem(name);
        } catch(e) {
            return null;
        }
    },

    unset: function(name) {
        try {
            this.storage.removeItem(name);
        } catch(e) {}
    },

    getKeysWithPrefix: function(keyPrefix) {
        var allKeys = Object.getOwnPropertyNames(this.storage);
        var matchingKeys = allKeys.filter(function(key){ return key.match('^'+keyPrefix+'.*$'); });
        if ( (typeof matchingKeys !== 'undefined') && (matchingKeys.length > 0) ) {
            // one or more matching keys found
            return matchingKeys;
        }

        // no matching keys found in localstore
        // return an empty list
        return [];
    }

};

module.exports = new localonly();