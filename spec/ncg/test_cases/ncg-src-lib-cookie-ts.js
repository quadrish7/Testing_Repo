describe("ncg-src-lib-cookie-testSuite.js", function() {

	// OBJECTIVE  
		// To test the cookie set and get logic

	// GENERAL conditions to be checked across all test cases  
		// Check for document.cookie support

	// ASSUMPTIONs
		// javascript and cookie API is supported by the browsers

	// TEST library methods
		// getCookieByNamePattern(namePattern)
		// get(name)
		// getWithSuffix(name, suffix)


	// TEST_CASES

		// TEST_SPEC_1 ::: cookie support 
			// check for support in browser environment

		// TEST_SPEC_2 ::: check cookie get using cookie name pattern input
			// -> getCookieByNamePattern

		// TEST_SPEC_3 ::: check NO cookie name exist matching the name input pattern
			// -> getCookieByNamePattern

		// TEST_SPEC_4 ::: Get cookie value using specific cookie name as input
			// -> get	

		// TEST_SPEC_5 ::: Get cookie value using specific cookie name and its regexp pattern suffix as input
			// -> getWithSuffix

		// TEST_SPEC_6 ::: Get cookie value using specific cookie name and its static string suffix as input
			// -> getWithSuffix


	// local vars 	
    var cookie	= require('../../../src/lib/cookie.js');
    var test_utils = require('../../../spec/ncg/test_utils');
    var getCookieByNamePattern = cookie.getCookieFromNamePattern;
    var getCookieByName = cookie.get;
    var getCookieByNameSuffix = cookie.getWithSuffix;
    var setCookie = cookie.set;


	// TEST_SPEC_1
	it("Test cookie Storage API support", function() {
		expect(document.cookie).toBeDefined();
	});

	// TEST_SPEC_2
	it("Get cookie value using cookie name regexp pattern as input", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libCookie/spec1.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		
		// add cookies
		test_utils.addCookies(spec.cookies);
		var actual_output   = unescape(getCookieByNamePattern(spec_input)); 
		// NOTE: here 'unescape' is required ONLY FOR TEST CASES as setCookie function uses 'escape' for adding to cookie at client side

		// run test cases 
		expect(actual_output).toBe(spec_output);
		// remove cookies
		test_utils.removeCookies(spec.cookies);
	});

	// TEST_SPEC_3
	it("Check when NO valid cookie name matching regexp pattern exist", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libCookie/spec2.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		
		// add cookies
		test_utils.addCookies(spec.cookies);
		var actual_output   = getCookieByNamePattern(spec_input);

		// run test cases 
		expect(actual_output).toBe(spec_output);
		// remove cookies
		test_utils.removeCookies(spec.cookies);
	});

	// TEST_SPEC_4
	it("Get cookie value using specific cookie name as input", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libCookie/spec3.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		
		// add cookies
		test_utils.addCookies(spec.cookies);
		var actual_output   = unescape(getCookieByName(spec_input));
		// NOTE: here 'unescape' is required ONLY FOR TEST CASES as setCookie function uses 'escape' for adding to cookie at client side

		// run test cases 
		expect(actual_output).toBe(spec_output);
		// remove cookies
		test_utils.removeCookies(spec.cookies);
	});

	// TEST_SPEC_5
	it("Get cookie value using specific cookie name and its regexp pattern suffix as input", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libCookie/spec4.js');
		var spec_input      = spec.input;
		var spec_input_suffix = spec.inputSuffix;		
		var spec_output     = spec.output;
		
		// add cookies
		test_utils.addCookies(spec.cookies);
		var actual_output   = unescape(getCookieByNameSuffix(spec_input,spec_input_suffix));
		// NOTE: here 'unescape' is required ONLY FOR TEST CASES as setCookie function uses 'escape' for adding to cookie at client side

		// run test cases 
		expect(actual_output).toBe(spec_output);
		// remove cookies
		test_utils.removeCookies(spec.cookies);
	});
	
	// TEST_SPEC_6
	it("Get cookie value using specific cookie name and its static string suffix as input", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libCookie/spec5.js');
		var spec_input      = spec.input;
		var spec_input_suffix = spec.inputSuffix;		
		var spec_output     = spec.output;
		
		// add cookies
		test_utils.addCookies(spec.cookies);
		var actual_output   = unescape(getCookieByNameSuffix(spec_input,spec_input_suffix));
		// NOTE: here 'unescape' is required ONLY FOR TEST CASES as setCookie function uses 'escape' for adding to cookie at client side

		// run test cases 
		expect(actual_output).toBe(spec_output);
		// remove cookies
		test_utils.removeCookies(spec.cookies);
	});


});