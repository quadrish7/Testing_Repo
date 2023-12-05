var Common = function (params) {
	this.params = params;
}

Common.prototype = {

	getMetadata: function(key) {
		var el = document.querySelector('meta[name="' + key +'"]');
		if (!el) el = document.querySelector('meta[property="' + key +'"]');
		if (el) {
			return el.getAttribute('content');
		} 
	}

}

module.exports =  new Common;

