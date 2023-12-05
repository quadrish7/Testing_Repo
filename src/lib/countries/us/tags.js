var deviceid = require('../../tags/deviceid');
var RegionTags = function (params) {
	this.params = params;
}

RegionTags.prototype = {

	//Country - All US specific tags should eventually go here
	load: function (params,ncgRef) {
		var self = this;
		// fire device id sync tag
		var deviceidTag = new deviceid(document.location.hostname, 
			params.tagsConfig, 
			params.deviceIdSyncTime);
		if (deviceidTag.shouldRun()) {
			deviceidTag.run();
		}
	},
}

module.exports = new RegionTags;

