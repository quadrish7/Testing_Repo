describe("ncg-src-lib-ajax-testSuite.js", function() {

	// local vars 	
    var ajax = require('../../../src/lib/ajax.js');

	// TEST_SPEC_1
	it("Test ajax API support", function() {
		var xmlHttp = new window.XMLHttpRequest();
		expect(xmlHttp).toBeDefined();
		if(xmlHttp) {
			expect(xmlHttp.open).toBeDefined();
			expect(xmlHttp.onreadystatechange).toBeDefined();
			expect(xmlHttp.readyState).toBeDefined();
			expect(xmlHttp.send).toBeDefined();		
			expect(xmlHttp.responseText).toBeDefined();
			expect(XMLHttpRequest.DONE).toBeDefined();
		}
	});

	// TEST_SPEC_2
	it("Test ajax params(obj) with return value as url query string ", function() {	
		// set data 
		var spec_input = {
			'key1': 'value1',
			'key1/key?:&=+$#': '12,3$*#',
			',/key1?&=key2+$': 'test/,test?test:test@test&test=test+test$test#'
		};
		var spec_output  = "";
			spec_output += encodeURIComponent('key1')+'='+encodeURIComponent('value1');
			spec_output += "&";
			spec_output += encodeURIComponent('key1/key?:&=+$#')+'='+encodeURIComponent('12,3$*#');
			spec_output += "&";
			spec_output += encodeURIComponent(',/key1?&=key2+$')+'='+encodeURIComponent('test/,test?test:test@test&test=test+test$test#');	

		// get data 
		var actual_output = ajax.params(spec_input);

		// run test case
		expect(actual_output).toBe(spec_output);
	});


});