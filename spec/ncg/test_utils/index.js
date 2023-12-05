var cookie	= require('../../../src/lib/cookie.js');
module.exports = {
	areNullValuesExist: function(obj) {
		var isNullValueExist = false;
		var new_obj = JSON.stringify(obj, function(key,value) {
			if(!isNullValueExist && value===null) {
				isNullValueExist = true;
			}
			return value===null?"__NULL__":value;
		});
		return isNullValueExist;
	},
	convertToJsValue: function(val) {
		return JSON.parse(JSON.stringify(val));		
	},
	// helper functions for set and remove url path name data for unit testing mode only
	setUrlPathNameData: function(spec_input) {
		window._ncg_kjut = {
			'location.pathname': spec_input['location.pathname']
		};
	},
	removeUrlPathNameData: function() {
		// remove window._ncg_kjut object data created for this test case
		delete window._ncg_kjut;
	},
    addCookies: function(specCookies) {   	
		specCookies.forEach(function(arr){
			cookie.set(arr[0],arr[1]);
		});
    },
    removeCookies: function(specCookies) {
		specCookies.forEach(function(arr){
			cookie.set(arr[0],"");
		});
    }
}