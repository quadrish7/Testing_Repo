describe("us-schema-getRESearchSchema-testSpec.js", function() {

	// var
	var test_utils = require('../../../spec/ncg/test_utils');
	var schema_us  = require('../../../src/lib/countries/us/schemas');
	var getRESearchSchema = schema_us.getRESearchSchema;
	

	// TEST_SPEC_1 : test realtor search pages schema spec_1 
	it("test_realtor_search_pages_spec_1", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getRESearchSchema/spec1');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		window.MOVE_DATA    = spec_input.data;
		var actual_output   = getRESearchSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// delete window key set for this test case
		delete window.MOVE_DATA;
	});

	// TEST_SPEC_2 : test realtor search pages schema spec_2 
	it("test_realtor_search_pages_spec_2", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getRESearchSchema/spec2');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		window.MOVE_DATA    = spec_input.data;
		var actual_output   = getRESearchSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// delete window key set for this test case
		delete window.MOVE_DATA;
	});

	// TEST_SPEC_3 : test realtor search pages schema spec_3 
	it("test_realtor_search_pages_spec_3", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getRESearchSchema/spec3');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		window.adobeDTM     = spec_input.data;
		var actual_output   = getRESearchSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// delete window key set for this test case
		delete window.adobeDTM;
	});

});