describe("us-schema-getArticleSchema-testSpec.js", function() {

	// GENERAL conditions to be checked across all test cases  
		// Global window.ncgobjects existence can be optional i.e whether they exist or not exist, result should be true
		// ALL_TEST_SPECS : Checks that any object's property should NOT be set to NULL or should NOT hold NULL value properties

	// ASSUMPTIONs
		// article.id named meta tag always exist to identify wsj, barrons, market watch articles
		// section name will be extracted from page URL when article.section named meta tag does not exist
		// when article.id meta tag does not exist, page.section meta tag will be used to identify these 3 sites articles
		// heatst - window.utag_data global object is used to test this scenario
		// nypost, pagesix, decider - window.dataLayer[0] global object is used to test this scenario

	// TEST_CASES 	
		// wsj, barrons, market watch site related schema test cases 
			// TEST_SPEC_1 ::: with VALID values - COMPLETE DATA i.e all meta tags exist with thier values set
			// TEST_SPEC_2 ::: with VALID values - PARTIAL data i.e article_id exist, Other tags some exist and some does not exist
			// TEST_SPEC_3 ::: with VALID values - PARTIAL data i.e when only page.section and page.subsection meta tags exist 

		// heatst related schema test cases
			// TEST_SPEC_4 ::: with VALID values - COMPLETE DATA i.e all values exist in window.utag_data
			// TEST_SPEC_5 ::: with VALID values - PARTIAL data i.e some values are not set in window.utag_data data

		// nypost, pagesix, decider related schema test cases
			// TEST_SPEC_6 ::: with VALID values - COMPLETE DATA i.e all values exist in window.dataLayer[0]

		// efn/fnlondon related schema test cases
			// TEST_SPEC_7 ::: with VALID values - COMPLETE DATA i.e all meta tags exist with thier values set
				// NOTE: with latest website meta tags, it seems page.section based condition would be used for efn/fnlondon site page

		// realtor.com related schema test cases
			// TEST_SPEC_8 ::: with VALID values - COMPLETE DATA i.e all meta tags exist with thier values set

	// var
	var test_utils = require('../../../spec/ncg/test_utils');
	var schema_us  = require('../../../src/lib/countries/us/schemas');
	var getArticleSchema = schema_us.getArticleSchema;
	
	// before each test case, reset head meta tags section
	beforeEach(function(){
		document.head.innerHTML = "";
	});

	// TEST_SPEC_1 : test wsj_b_mw articles schema spec_1 
	it("test_wsj_b_mw_article_spec_1", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema/spec1');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		test_utils.setUrlPathNameData(spec_input);
		document.head.innerHTML = spec_input.data;	
		var actual_output   = getArticleSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		test_utils.removeUrlPathNameData();
	});


	// TEST_SPEC_2 : test wsj_b_mw articles schema spec_2
	it("test_wsj_b_mw_article_spec_2", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema/spec2');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		test_utils.setUrlPathNameData(spec_input);
		document.head.innerHTML = spec_input.data;	
		var actual_output   = getArticleSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		test_utils.removeUrlPathNameData();
	});


	// TEST_SPEC_3 : test wsj_b_mw_ef articles schema spec_3
	it("test_wsj_b_mw_ef_article_spec_3", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema/spec3');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		test_utils.setUrlPathNameData(spec_input);
		document.head.innerHTML = spec_input.data;	
		var actual_output   = getArticleSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		test_utils.removeUrlPathNameData();
	});


	// TEST_SPEC_4 : test heat_st articles schema spec_4
	it("test_heat_st_article_spec_4", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema/spec4');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		test_utils.setUrlPathNameData(spec_input);
		window.utag_data    = spec_input.data;		
		var actual_output   = getArticleSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// remove window.utag_data object data created for this test case
		delete window.utag_data;
		test_utils.removeUrlPathNameData();
	});


	// TEST_SPEC_5 : test heat_st articles schema spec_5
	it("test_heat_st_article_spec_5", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema/spec5');		
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data 
		test_utils.setUrlPathNameData(spec_input);
		window.utag_data    = spec_input.data;		
		var actual_output   = getArticleSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// remove window.utag_data object data created for this test case
		delete window.utag_data;
		test_utils.removeUrlPathNameData();
	});

	// TEST_SPEC_6 : test nypd articles schema spec_6
	it("test_nypd_article_spec_6", function() {
		// get test case data
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema/spec6');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		test_utils.setUrlPathNameData(spec_input);
		window.dataLayer    = spec_input.data;
		var actual_output   = getArticleSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// remove window.utag_data object data created for this test case
		delete window.dataLayer;
		test_utils.removeUrlPathNameData();
	});

	// TEST_SPEC_7 : test efn/fnlondon articles schema spec_7
	it("test_efn_article_spec_7", function() {
		// get test case data
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema/spec7');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		test_utils.setUrlPathNameData(spec_input);
		document.head.innerHTML = spec_input.data;
		var actual_output   = getArticleSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		test_utils.removeUrlPathNameData();
	});

	// TEST_SPEC_8 : test realtor.com articles schema spec_8
	it("test_realtor_article_spec_8", function() {
		// get test case data
		var spec 			= require('../../../spec/ncg/test_data/getArticleSchema/spec8');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		// set page data
		test_utils.setUrlPathNameData(spec_input);
		document.head.innerHTML = spec_input.data;
		var actual_output   = getArticleSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);
		// run test cases
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		test_utils.removeUrlPathNameData();
	});


});