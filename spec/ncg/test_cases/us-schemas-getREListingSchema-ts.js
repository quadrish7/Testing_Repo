describe("us-schema-getREListingSchema-testSpec.js", function() {

	// var
	var test_utils = require('../../../spec/ncg/test_utils');
	var schema_us  = require('../../../src/lib/countries/us/schemas');
	var getREListingSchema = schema_us.getREListingSchema;	

	// TEST_SPEC_1 : test realtor listing pages schema spec_1 
	it("test_realtor_listing_pages_spec_1", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getREListingSchema/spec1');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		window.MOVE_DATA    = spec_input.data;
		var actual_output   = getREListingSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// delete window key set for this test case
		delete window.MOVE_DATA;
		document.head.innerHTML = "";
	});

	// TEST_SPEC_2 : test realtor listing pages schema spec_2 
	it("test_realtor_listing_pages_spec_2", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getREListingSchema/spec2');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		window.adobeDTM     = spec_input.data;
		var actual_output   = getREListingSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// delete window key set for this test case
		delete window.adobeDTM;
	});

	// TEST_SPEC_3 : test realtor listing pages schema spec_3 
	it("test_realtor_listing_pages_spec_3", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getREListingSchema/spec3');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		document.body.innerHTML = spec_input.bodyHTML;
		var actual_output   = getREListingSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// reset page html
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});

	// TEST_SPEC_4 : test realtor listing pages schema spec_4 
	it("test_realtor_listing_pages_spec_4", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getREListingSchema/spec4');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		document.body.innerHTML = spec_input.bodyHTML;
		var actual_output   = getREListingSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// reset page html
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});

	// TEST_SPEC_5 : test realtor listing pages schema spec_5 
	it("test_realtor_listing_pages_spec_5", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getREListingSchema/spec5');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		document.body.innerHTML = spec_input.bodyHTML;
		var actual_output   = getREListingSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// reset page html
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});

	// TEST_SPEC_6 : test realtor listing pages schema spec_6 
	it("test_realtor_listing_pages_spec_6", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getREListingSchema/spec6');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		document.body.innerHTML = spec_input.bodyHTML;
		var actual_output   = getREListingSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// reset page html
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});

	// TEST_SPEC_7 : test realtor listing pages schema spec_7 
	it("test_realtor_listing_pages_spec_7", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getREListingSchema/spec7');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		document.body.innerHTML = spec_input.bodyHTML;
		var actual_output   = getREListingSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// reset page html
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});

	// TEST_SPEC_8 : test realtor listing pages schema spec_8 
	it("test_realtor_listing_pages_spec_8", function() {
		// get test case data 
		var spec 			= require('../../../spec/ncg/test_data/getREListingSchema/spec8');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		document.body.innerHTML = spec_input.bodyHTML;
		var actual_output   = getREListingSchema();
		var is_null_exist   = test_utils.areNullValuesExist(actual_output);

		// run test cases 
		expect(is_null_exist).toEqual(false);
		expect(actual_output).toEqual(spec_output);
		// reset page html
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});


});