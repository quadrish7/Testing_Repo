var cookie = require('../lib/cookie');
var local = require('../lib/local');
var newsbus = require('./newsbus');
var extend = require('extend');

var ncgid = function() {
    newsbus(this,'events');
};

ncgid.prototype = {

    // Default prefix for ncg preferences object
    // Eg: in AU for historical reasons, the prefix is 'disc.'
    prefsPrefix: '_ncg_prefs_.',

    events: [],

    /*
     *  params = {
     *      domain_id: 'def' | null
     *  }
     */
    update: function(params) {
        // Update _ncg_id_ cookie
        cookie.set('_ncg_id_', params.domain_id, 60*24*365*2, cookie.findCookieDomain());
    },

    getMatchid: function() {
        /** 
         * TODO: remove this function altogether
         *  match id is not used anymore 
         */
        return null;
    },

    setPreferencesFromObject: function(obj) {
        var self = this;
        var prefs = {};
        var flattened = {};
        var tmp_prefs = {};
        // first delete previous prefernces
        local.get('_ncg_prefs_keys_').split(',').forEach(function(pref) {
            local.unset(pref);
        });
        // now get the preferences and metadata for each groupid
        if (obj.groupids && Array.isArray(obj.groupids)) {
            obj.groupids.forEach(function(lookupid) { 
                if (lookupid.preferences && Array.isArray(lookupid.preferences)) {
                    tmp_prefs = self.extractPreferences(lookupid.preferences);
                    prefs = extend(prefs, tmp_prefs[0]);
                    flattened = extend(flattened, tmp_prefs[1]);
                }
                if (lookupid.metadata && typeof lookupid.metadata === "object") {
                    var metadata = [];
                    Object.keys(lookupid.metadata).forEach(function(k) {
                        metadata.push({
                            name: k,
                            value: lookupid.metadata[k]
                        });
                    });
                    tmp_prefs = self.extractPreferences(metadata);
                    prefs = extend(prefs, tmp_prefs[0]);
                    flattened = extend(flattened, tmp_prefs[1]);  
                }
            });
        }
        // now get the matchid preferences and metadata
        if (obj.preferences && Array.isArray(obj.preferences)) {
            tmp_prefs = this.extractPreferences(obj.preferences);
            prefs = extend(prefs, tmp_prefs[0]);
            flattened = extend(flattened, tmp_prefs[1]);
        }
        if (obj.metadata && typeof obj.metadata === "object") {
            var metadata = [];
            Object.keys(obj.metadata).forEach(function(k) {
                metadata.push({
                    name: k,
                    value: obj.metadata[k]
                });
            });
            tmp_prefs = this.extractPreferences(metadata);
            prefs = extend(prefs, tmp_prefs[0]);
            flattened = extend(flattened, tmp_prefs[1]);
        }
        // Finally, send set events for each pref
        Object.keys(prefs).forEach(function(pref) {
            self.events.push(['setPreferences', prefs[pref]])
        });
        // ...and set them in localStorage
        Object.keys(flattened).forEach(function(pref) {
            local.set(pref, flattened[pref]);
        });
        // cache returned keys, so we can delete them later
        local.set('_ncg_prefs_keys_', Object.keys(flattened).join(','));
        // return prefs
        return [prefs, flattened];
    },

    /*
     * Extract preferences from data and return a tuple [prefs, flattened]
     * @prefs are the raw preferences
     * @flattened are the flattened values complatible with localStorage
     * Note: the flattened localStorage version is required by Krux. Should be reviewed if still needed.
     */
    extractPreferences: function(data) {
        var prefs = {};
        var flattened = {};
        for (var i=0; i<data.length; i++) {
            var pref = data[i];
            var val = pref.value;
            try {
                val = JSON.parse(val);
            } catch (e) {};
            var tmp = {};
            tmp[pref.name] = val;
            var vals = local.flatten(tmp, '');
            if (vals.length) {
                for (var j=0; j<vals.length; j++) {
                    flattened[this.prefsPrefix+vals[j].k] = (typeof vals[j].v === 'object') ? JSON.stringify(vals[j].v) : vals[j].v ;
                }
            }
            else {
                flattened[this.prefsPrefix+pref.name] = (typeof pref.value === 'object') ? JSON.stringify(pref.value) : pref.value ;
            }
            if (pref.lastUpdated) {
                flattened[this.prefsPrefix+pref.name+'_updated'] = pref.lastUpdated;
            }
            prefs[pref.name] = pref;
        }
        return [prefs, flattened];
    },

    getPreference: function(name) {
        var pref = local.get(this.prefsPrefix+name);
        try {
            pref = JSON.parse(pref);
        }
        catch (e) {
            // retrun "raw" value
        }
        return pref;
    }
}

module.exports = new ncgid;