describe("ncg-src-lib-config-us-testSuite.js", function() {

	// OBJECTIVE : Write unit test cases to verify and validate with NCG configuration  
		// OBA Participating domain/site - Verification and Validation with NCG configuration 
		// OBA Network domain/group - Verification and Validation with NCG configuration
		// Test cases for different envs/country i.e prod,uat,sit and us,au,ir 

	// GENERAL conditions to be checked across all test cases  

	// ASSUMPTIONs

	// TEST_CASES 	
		// check that a website exists in the tracking/participating sites list
			// input  : "test1.com", 
			// output : "test1.com" configuration object (test with different configuration parameters sites as input sites)
				// - To check a users website eligibility to ncg tracking
				// - without latest DNT changes

		// a website exists in the tracking sites list and it is linked to a group network domain
			// input  : "test2.com" linked to a group network domain "tags.test2.com", 
			// output : "test2.com" configuration object along with "tags.test2.com" group network domain details
				// (test with different group domain configuration parameters sites as input sites)

		// a website does not exist in the tracking/participating sites list



	// local vars 	
	var test_utils   = require('../../../spec/ncg/test_utils');
	var spec_us 	 = require('../../../spec/ncg/test_data/libConfig/spec-us.js');
    var domainConfig = require('../../../src/lib/config')(spec_us.config);
    var findDomain   = domainConfig.findDomain;

	// TEST_SPEC_1 ::: check that a website exists in the tracking/participating sites list
	// TEST_SPEC_2 ::: check that a website exists in the tracking/participating sites list
	it("test_us_spec_1", function() {
		// get test case data 
		var spec 			= spec_us.spec1;
		var spec_input      = spec.input;
		var spec_output     = test_utils.convertToJsValue(spec.output);
		var actual_output   = test_utils.convertToJsValue(findDomain(spec_input));
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});
	it("test_us_spec_2", function() {
		// get test case data 
		var spec 			= spec_us.spec2;
		var spec_input      = spec.input;
		var spec_output     = test_utils.convertToJsValue(spec.output);
		var actual_output   = test_utils.convertToJsValue(findDomain(spec_input));
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_3 ::: check that a website exists in the tracking/participating sites list with different configuration parameters
	// TEST_SPEC_4 ::: check that a website exists in the tracking/participating sites list with different configuration parameters
	it("test_us_spec_3", function() {
		// get test case data 
		var spec 			= spec_us.spec3;
		var spec_input      = spec.input;
		var spec_output     = test_utils.convertToJsValue(spec.output);
		var actual_output   = test_utils.convertToJsValue(findDomain(spec_input));
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});
	it("test_us_spec_4", function() {
		// get test case data 
		var spec 			= spec_us.spec4;
		var spec_input      = spec.input;
		var spec_output     = test_utils.convertToJsValue(spec.output);
		var actual_output   = test_utils.convertToJsValue(findDomain(spec_input));
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_5 ::: check for website that does not exist in the sites list must return false  
	it("test_us_spec_5", function() {
		// get test case data 
		var spec 			= spec_us.spec5;
		var spec_input      = spec.input;
		var spec_output     = test_utils.convertToJsValue(spec.output);
		var actual_output   = test_utils.convertToJsValue(findDomain(spec_input));
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_6 ::: check for .co.uk domains whitelisting validation
	it("test_us_spec_6", function() {
		// get test case data 
		var spec 			= spec_us.spec6;
		var spec_input      = spec.input;
		var spec_output     = test_utils.convertToJsValue(spec.output);
		var actual_output   = test_utils.convertToJsValue(findDomain(spec_input));
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_7 ::: check for .ie domains whitelisting validation
	it("test_us_spec_7", function() {
		// get test case data 
		var spec 			= spec_us.spec7;
		var spec_input      = spec.input;
		var spec_output     = test_utils.convertToJsValue(spec.output);
		var actual_output   = test_utils.convertToJsValue(findDomain(spec_input));
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_8 ::: check for .com domains whitelisting validation
	it("test_us_spec_8", function() {
		// get test case data 
		var spec 			= spec_us.spec8;
		var spec_input      = spec.input;
		var spec_output     = test_utils.convertToJsValue(spec.output);
		var actual_output   = test_utils.convertToJsValue(findDomain(spec_input));
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});


});