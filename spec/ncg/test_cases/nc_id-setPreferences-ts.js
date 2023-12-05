describe("nc_id-setPreferences.js", function() {

	// GENERAL conditions to be checked across all test cases  
		// Global window.ncgobjects existence can be optional i.e whether they exist or not exist, result should be true
		// ALL_TEST_SPECS : Checks that any object's property should NOT be set to NULL or should NOT hold NULL value properties

	// ASSUMPTIONs
		// getAkaSchema(params) - This methods first and only parameter should always receive a javasript object type value i.e Object type 		

	// TEST_CASES 	
		// TEST_SPEC_1 ::: with VALID values   - COMPLETE DATA i.e NO 'null' or 'undefined' primitive values 
		// TEST_SPEC_2 ::: with VALID values   - PARTIAL data i.e some properties exist and some does not exist or set to undefined
		// TEST_SPEC_3 ::: with INVALID values - function parameter value is an empty object
		// TEST_SPEC_4 ::: with INVALID values - all or some properties of the object set to 'null' primitive value


	// local vars 	
	var test_utils   = require('../../../spec/ncg/test_utils');
	var nc_id    	 = require('../../../src/lib/ncg_id');

	it("test_spec_1", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/aapi/spec1');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = nc_id.setPreferencesFromObject(spec_input);

		// replace spec_output prefix with nc_id prefix
		var clean_output = {}
		Object.keys(spec_output[1]).forEach(function(k) {
			clean_output[k.replace('{PREFIX}', nc_id.prefsPrefix)] = spec_output[1][k];
		});
		spec_output[1] = clean_output;
		// run test cases 
		expect(actual_output).toEqual(spec_output);		
	});

	it("test_spec_2", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/aapi/spec2');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = nc_id.setPreferencesFromObject(spec_input);

		//console.log(actual_output);
		// replace spec_output prefix with nc_id prefix
		var clean_output = {}
		Object.keys(spec_output[1]).forEach(function(k) {
			clean_output[k.replace('{PREFIX}', nc_id.prefsPrefix)] = spec_output[1][k];
		});
		spec_output[1] = clean_output;
		// run test cases 
		expect(actual_output).toEqual(spec_output);		
	});
	
	it("should cache AAPI keys", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/aapi/spec2');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = nc_id.setPreferencesFromObject(spec_input);

		var cache = localStorage.getItem('_ncg_prefs_keys_');
		expect(cache.split(',').sort()).toEqual(Object.keys(spec_output[1]).map(function(k) {
			return k.replace('{PREFIX}', nc_id.prefsPrefix)
		}).sort());
		
	});

	it("should delete old AAPI keys", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/aapi/spec3');		

		// See if all keys are set
		nc_id.setPreferencesFromObject(spec.input1);
		spec.output.cache1.forEach(function(k) {
			expect(localStorage.getItem(nc_id.prefsPrefix+k)).toBeDefined();
			expect(localStorage.getItem(nc_id.prefsPrefix+k)).not.toBeNull();
		});

		// See if all new keys are set
		nc_id.setPreferencesFromObject(spec.input2);
		spec.output.cache2.forEach(function(k) {
			expect(localStorage.getItem(nc_id.prefsPrefix+k)).toBeDefined();
			expect(localStorage.getItem(nc_id.prefsPrefix+k)).not.toBeNull();
		});

		// Now specifically test for deleted keys
		spec.output.deleted.forEach(function(k) {
			expect(localStorage.getItem(nc_id.prefsPrefix+k)).toBeNull();
		});
	});
	

});