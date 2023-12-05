describe("au-schema-getArticleSchema-testSpec.js", function() {

	// GENERAL conditions to be checked across all test cases  
		// Global window.ncgobjects existence can be optional i.e whether they exist or not exist, result should be true
		// ALL_TEST_SPECS : Checks that any object's property should NOT be set to NULL or should NOT hold NULL value properties

	// ASSUMPTIONs
		// all au sites - window.utag_data global object is used to test this scenario

	// TEST_CASES 	

		// au sites related schema test cases
			// TEST_SPEC_1 ::: with VALID values - COMPLETE DATA i.e all values exist in window.utag_data
			// TEST_SPEC_2 ::: with VALID values - PARTIAL data i.e some values are not set in window.utag_data data
			// TEST_SPEC_3 ::: with INVALID values i.e empty object in this case

	// var
	var test_utils = require('../../../spec/ncg/test_utils');
	var schema_au  = require('../../../src/lib/countries/au/schemas');
	var getArticleSchema = schema_au.getArticleSchema;

	// TEST_SPEC_1 : test au site articles schema spec_1
	it("test_au_site_article_spec_1", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema-au/spec1');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		window.utag_data    = spec_input.data;		
		var actual_output   = getArticleSchema.call(schema_au);
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// remove window.utag_data object data created for this test case
		delete window.utag_data;
	});


	// TEST_SPEC_2 : test au site articles schema spec_2
	it("test_au_site_article_spec_2", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema-au/spec2');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		window.utag_data    = spec_input.data;		
		document.head.innerHTML = spec_input.metaHTML;	
		var actual_output   = getArticleSchema.call(schema_au);
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// remove window.utag_data object data created for this test case
		delete window.utag_data;
		document.head.innerHTML = "";
	});


	// TEST_SPEC_3 : test au site articles schema spec_3
	it("test_au_site_article_spec_3", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema-au/spec3');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		window.utag_data    = spec_input.data;		
		var actual_output   = getArticleSchema.call(schema_au);
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// remove window.utag_data object data created for this test case
		delete window.utag_data;
	});

});