describe("au-schema-getAkaSchema-testSpec.js", function() {

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
	var schema_au    = require('../../../src/lib/countries/au/schemas');
	var getAkaSchema = schema_au.getAkaSchema;

	// TEST_SPEC_1 ::: with VALID values   - COMPLETE DATA i.e NO 'null' or 'undefined' primitive values 
	it("test_spec_1", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getAkaSchema/spec1');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = getAkaSchema(spec_input.data);
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
	});
	
	// TEST_SPEC_2 ::: with VALID values   - PARTIAL data i.e some properties exist and some does not exist or set to undefined
	it("test_spec_2", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getAkaSchema/spec2');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = getAkaSchema(spec_input.data);
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_3 ::: with INVALID values - function parameter value is an empty object
	it("test_spec_3", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getAkaSchema/spec3');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = getAkaSchema(spec_input.data);
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_4 ::: with INVALID values - all or some properties of the object set to 'null' primitive value
	it("test_spec_4", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getAkaSchema/spec4');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = getAkaSchema(spec_input.data);
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
	});


});