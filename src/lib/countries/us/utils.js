var storage = require('../../local');

var RegionUtils = function (params) {
	this.params = params;
}

RegionUtils.prototype = {

	init: function (parent) {
		//do all country specific initialization here
		this.getNyPostUserIds();
		this.populateNyPostAnalyticsId();
	},

	getNyPostUserIds: function() {
		if (!(window.ncg_data && window.ncg_data.user_id) && storage.get('janrainCaptureProfileData')) {
			try {
				var obj = JSON.parse(storage.get('janrainCaptureProfileData'));
				window.ncg_data.user_id = obj.uuid;
        		window.ncg_data.user_provider = 'nypost';
			}
			catch(e) {

			} 
		}
	},

	populateNyPostAnalyticsId: function() {
		// TODO: ncg_data should ideally be populated by NYPost team
		const NYP_GA_TRACKER_ID = "UA-3922003-6";
		try{
			ga.getAll().forEach(function(tracker){
				if (tracker.get('trackingId') === NYP_GA_TRACKER_ID) {
					window.ncg_data.browser_analytics_id = tracker.get("clientId");
					window.ncg_data.browser_analytics_provider = "ga";
				}
			});
		} catch(e) {
			// ga not found, it's ok to skip
		}
	},

	/*
	 * Note: this function will be attached to the context of a tag, so "this" is the actual tag.
	 */
	aapiExtraIds: function() {
		var ids = [];
		if (this.ncg_data.user_id) {
			ids.push({
				type: 'user',
				site: this.domainConfig.domain,
				value: this.ncg_data.user_id
			});
		}
		return ids;
	}
				
}

module.exports = new RegionUtils;

