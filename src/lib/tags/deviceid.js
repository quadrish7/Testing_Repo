var scheduler = require('../scheduler')('_ncg_sch_');
var pixel = require('../pixel');
var cookie = require('../cookie');

var DeviceId = function(domain, tagSites, syncTimeout) {
    this.domain = domain;
    this.tagSites = tagSites;
    this.syncTimeout = syncTimeout;
}

DeviceId.prototype = {
    id: '_ncg_devid_updtedon_',

    getTagSiteUrl: function() {
        if (!(this.domain && this.tagSites)) {
            return null;
        }
    
        for(var etldPlusOne in this.tagSites) {
            var pos = this.domain.lastIndexOf(etldPlusOne);
            var etldLength = etldPlusOne.length;
            if ( pos >= 0 &&
                pos+etldLength == this.domain.length) {
                    return `https://${this.tagSites[etldPlusOne][0]}/prod/deviceid/i`;
            }
        }
    
        return null;
    }, 

    endsWith: function(searchIn, pattern) {
        if (!searchIn ||
            !pattern ||
            pattern.length > searchIn.length) {
                return false;
        }
        var pos = searchIn.lastIndexOf(pattern);
        return pos >= 0 &&
            pos+pattern.length == searchIn.length;
    },

    getTagsEntry: function() {
        for(var etldPlusOne in this.tagSites) {
            if (this.endsWith(this.domain, etldPlusOne))
                return this.tagSites[etldPlusOne];
        }
    },

    shouldRun: function() {
        if (!this.domain ||
            !this.tagSites ||
            !this.syncTimeout)
                return false;
      
        var tagsEntry = this.getTagsEntry();
        if (!tagsEntry || 
            tagsEntry[1] == false)
            return false;
        
        return scheduler.checkOrSchedule(this.id, this.syncTimeout);
    },
    
    fireKruxTag: function() {
        var deviceId = cookie.get('_ncg_d_id_');
        if (deviceId) {
            /**
             * Device id format: {GUID}.{3PC-support}.{Create time}.{Update time}
             *  ex: 7ec8b5a8-c8a9-4ca7-beb8-f60b5666a656.3.1579663452.1579663452
             */
            var fixedDeviceId = deviceId.substring(0, deviceId.lastIndexOf('.'));
             var kruxUrl = `https://beacon.krxd.net/usermatch.gif?partner=newsiq_device&partner_uid=${fixedDeviceId}`;
            pixel.pixel({}, kruxUrl);
        } else {
            // TODO: edge case
            //  1. pixel image loaded, but device id cookie is not available
            //  2. log it to Snowplow ideally
            console.log('device id is missing');
        }
    },

    run: function() {
        // Fire the pixel
        var self = this;
        var tagsUrl = this.getTagSiteUrl();
		pixel.pixel({}, tagsUrl, self.fireKruxTag);
		scheduler.update(this.id);
	}

};

module.exports = DeviceId;
