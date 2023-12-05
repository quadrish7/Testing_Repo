describe("ncg-src-lib-snowplow-testSuite.js", function() {

	// local vars 	
    var sp	  = require('../../../src/lib/snowplow.js');
    var local = require('../../../src/lib/local.js');

	// TEST_SPEC_1
	it("Check snowplow guessDefaults dmp id and provider : When data is in function parameters object", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libSnowplow/spec1.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = sp.guessDefaults(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_2
	it("Check snowplow guessDefaults dmp id and provider : When data is found in local storage 'kxuser'", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libSnowplow/spec2.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set data
		spec_input.localStorage.forEach(function(val,index,arr){
			local.set(val[0],val[1]);
		});
		var actual_output   = sp.guessDefaults(spec_input.data); 

		// run test cases 
		expect(actual_output).toEqual(spec_output);
		// remove data
		spec_input.localStorage.forEach(function(val,index,arr){
			local.unset(val[0]);
		});
	});

	// TEST_SPEC_3
	it("Check snowplow guessDefaults dmp id and provider : When data is found in local storage 'kxkuid'", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libSnowplow/spec3.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set data
		spec_input.localStorage.forEach(function(val,index,arr){
			local.set(val[0],val[1]);
		});
		var actual_output   = sp.guessDefaults(spec_input.data); 

		// run test cases 
		expect(actual_output).toEqual(spec_output);
		// remove data
		spec_input.localStorage.forEach(function(val,index,arr){
			local.unset(val[0]);
		});
	});

	// TEST_SPEC_4
	it("Check snowplow guessDefaults dmp id and provider : When NO data found either in page objects or in local storage ", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libSnowplow/spec4.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;
		var actual_output   = sp.guessDefaults(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

});