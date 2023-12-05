describe("ncg-src-lib-local-testSuite.js", function() {

	// local vars 	
    var local = require('../../../src/lib/local.js');
    var test_utils = require('../../../spec/ncg/test_utils');

	// TEST_SPEC_1
	it("Test localStorage API support", function() {
		expect(window.localStorage || document.cookie).toBeDefined();
		if(window.localStorage) {
			expect(window.localStorage.setItem).toBeDefined();
			expect(window.localStorage.getItem).toBeDefined();
			expect(window.localStorage.removeItem).toBeDefined();
		}
	});

	// TEST_SPEC_2
	it("Test localStorage session()", function() {
		expect(local.session()).not.toBe(local);
	});

	// TEST_SPEC_3
	it("Test localStorage set() and get()", function() {
		// set data
		var name  = "TEST_local_store_var1";
		var value = "value1";
		// run tests
		local.set(name,value);
		expect(local.get(name)).toBe(value);
	});

	// TEST_SPEC_4
	it("Test localStorage unset()", function() {
		// set data
		var name  = "TEST_local_store_var2";
		var value = "value2";
		// run tests
		local.set(name,value);
		expect(local.get(name)).toBe(value);		
		local.unset(name);
		expect(local.get(name)).not.toBe(value);
	});

	// TEST_SPEC_5
	it("Test localStorage increment()", function() {
		// set data
		var name  = "TEST_local_store_var3";
		var value = '1415';
		// run tests
		local.set(name,value);
		expect(local.get(name)).toBe(value);		

		local.increment(name);
		expect(local.get(name)).not.toBe(value+1);

		local.increment(name);
		expect(local.get(name)).not.toBe(value+2);

		local.increment(name);
		expect(local.get(name)).not.toBe(value+3);
	});

	// TEST_SPEC_6
	it("Test localStorage flatten()", function() {

		// CASE1
		var spec_input  = {a:{b:1},c:{d:{e:2}}};
		var spec_output = [
			{k:'a.b',   v:1},
			{k:'c.d.e', v:2}
		];
		var actual_output = local.flatten(spec_input,'');
		expect(JSON.stringify(actual_output)).toBe(JSON.stringify(spec_output));

		// CASE2
		var spec_input  = {a:[1,2,3,4,5,6],c:{d:[1,2,3]}};
		var spec_output = [
			{k:'a',   v:'1,2,3,4,5,6'},
			{k:'c.d', v:'1,2,3'}
		];
		var actual_output = local.flatten(spec_input,'');
		expect(JSON.stringify(actual_output)).toBe(JSON.stringify(spec_output));

		// CASE3
		var spec_input  = {a:{b:{c:{d:{e:{f:100}}}}}, g:{h:{i:{j:[100,200,300,400,500]}}}};
		var spec_output = [
			{k:'a.b.c.d.e.f',  v:100},
			{k:'g.h.i.j',      v:'100,200,300,400,500'}
		];
		var actual_output = local.flatten(spec_input,'');
		expect(JSON.stringify(actual_output)).toBe(JSON.stringify(spec_output));
	});


});