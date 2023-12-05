describe("ncg-src-lib-metadata-testSuite.js", function() {

	// local vars 	
    var Metadata = require('../../../src/lib/metadata.js');
    var Metadata1 = require('../../../src/lib/countries/common.js');
    var test_utils = require('../../../spec/ncg/test_utils');

	// TEST_SPEC_1
	it("Get metadata from 'name' meta tags", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libMetadata/spec1.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		var actual_output   = Metadata.getMetadata(spec_input.data);
		var actual_output1  = Metadata1.getMetadata(spec_input.data);
		// run test cases 
		expect(actual_output).toEqual(spec_output);
		expect(actual_output1).toEqual(spec_output);
		// remove page data
		document.head.innerHTML = "";
	});

	// TEST_SPEC_2
	it("Get metadata from 'property' meta tags", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libMetadata/spec2.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		var actual_output   = Metadata.getMetadata(spec_input.data); 
		var actual_output1  = Metadata1.getMetadata(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);
		expect(actual_output1).toEqual(spec_output);
		// remove page data
		document.head.innerHTML = "";
	});

	// TEST_SPEC_3
	it("Get metadata when NO macthing meta tags exist", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libMetadata/spec3.js');
		var spec_input      = spec.input;
		var spec_output     = spec.output;

		// set page data 
		document.head.innerHTML = spec_input.metaHTML;
		var actual_output   = Metadata.getMetadata(spec_input.data); 
		var actual_output1  = Metadata1.getMetadata(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);
		expect(actual_output1).toEqual(spec_output);
		// remove page data
		document.head.innerHTML = "";
	});

	// TEST_SPEC_4
	it("Get metadata using parseAddress() address string parameter input", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libMetadata/spec4.js');

		// CASE1
		var spec_input      = spec.spec1.input;
		var spec_output     = spec.spec1.output;
		var actual_output   = Metadata.parseAddress(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);


		// CASE2
		var spec_input      = spec.spec2.input;
		var spec_output     = spec.spec2.output;
		var actual_output   = Metadata.parseAddress(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);


		// CASE3
		var spec_input      = spec.spec3.input;
		var spec_output     = spec.spec3.output;
		var actual_output   = Metadata.parseAddress(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);


		// CASE4
		var spec_input      = spec.spec4.input;
		var spec_output     = spec.spec4.output;
		var actual_output   = Metadata.parseAddress(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);


		// CASE5
		var spec_input      = spec.spec5.input;
		var spec_output     = spec.spec5.output;
		var actual_output   = Metadata.parseAddress(spec_input.data); 
		// run test cases 
		expect(actual_output).toEqual(spec_output);

	});


	// TEST_SPEC_5
	it("Test getSectionsFromURL(parseLimit) with valid pathname values", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libMetadata/spec5.js');
		var actual_output	= "";

		// set page data 
		test_utils.setUrlPathNameData(spec);

		// run test cases
		actual_output = Metadata.getSectionsFromURL(spec.spec1.input); 
		expect(actual_output).toEqual(spec.spec1.output);

		actual_output = Metadata.getSectionsFromURL(spec.spec2.input); 
		expect(actual_output).toEqual(spec.spec2.output);

		actual_output = Metadata.getSectionsFromURL(spec.spec3.input); 
		expect(actual_output).toEqual(spec.spec3.output);

		actual_output = Metadata.getSectionsFromURL(spec.spec4.input); 
		expect(actual_output).toEqual(spec.spec4.output);

		// remove page data
		test_utils.removeUrlPathNameData();
	});

	// TEST_SPEC_6
	it("Test getSectionsFromURL(parseLimit) with valid and invalid pathname values", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libMetadata/spec6.js');
		var actual_output	= "";

		// CASE1
		// set page data 
		test_utils.setUrlPathNameData(spec.spec1);
		actual_output = Metadata.getSectionsFromURL(spec.spec1.input); 
		// run test cases
		expect(actual_output).toEqual(spec.spec1.output);

		// CASE2
		// set page data 
		test_utils.setUrlPathNameData(spec.spec2);
		actual_output = Metadata.getSectionsFromURL(spec.spec2.input); 
		// run test cases
		expect(actual_output).toEqual(spec.spec2.output);

		// CASE3
		// set page data 
		test_utils.setUrlPathNameData(spec.spec3);
		actual_output = Metadata.getSectionsFromURL(spec.spec3.input); 
		// run test cases
		expect(actual_output).toEqual(spec.spec3.output);

		// CASE4
		// set page data 
		test_utils.setUrlPathNameData(spec.spec4);
		actual_output = Metadata.getSectionsFromURL(spec.spec4.input); 
		// run test cases
		expect(actual_output).toEqual(spec.spec4.output);

		// remove page data
		test_utils.removeUrlPathNameData();
	});


	// TEST_SPEC_7
	it("Test getSectionsList(section, subsection, subsubsection, sections, parseLimit)", function() {
		// get test case data 
		var spec    	= require('../../../spec/ncg/test_data/libMetadata/spec7.js');

		// CASE1
		var spec_input  = spec.spec1.input;
		var spec_output = spec.spec1.output;
		var actual_output = Metadata.getSectionsList(
			spec_input.section,
			spec_input.subsection,
			spec_input.subsubsection,
			spec_input.urlPathnameSections,
			spec_input.parseLimit
		); 
		// run test cases
		expect(actual_output).toEqual(spec_output);


		// CASE2
		var spec_input  = spec.spec2.input;
		var spec_output = spec.spec2.output;
		var actual_output = Metadata.getSectionsList(
			spec_input.section,
			spec_input.subsection,
			spec_input.subsubsection,
			spec_input.urlPathnameSections,
			spec_input.parseLimit
		); 
		// run test cases
		expect(actual_output).toEqual(spec_output);


		// CASE3
		var spec_input  = spec.spec3.input;
		var spec_output = spec.spec3.output;
		var actual_output = Metadata.getSectionsList(
			spec_input.section,
			spec_input.subsection,
			spec_input.subsubsection,
			spec_input.urlPathnameSections,
			spec_input.parseLimit
		); 
		// run test cases
		expect(actual_output).toEqual(spec_output);


		// CASE4
		var spec_input  = spec.spec4.input;
		var spec_output = spec.spec4.output;
		var actual_output = Metadata.getSectionsList(
			spec_input.section,
			spec_input.subsection,
			spec_input.subsubsection,
			spec_input.urlPathnameSections,
			spec_input.parseLimit
		); 
		// run test cases
		expect(actual_output).toEqual(spec_output);


		// CASE5
		var spec_input  = spec.spec5.input;
		var spec_output = spec.spec5.output;
		var actual_output = Metadata.getSectionsList(
			spec_input.section,
			spec_input.subsection,
			spec_input.subsubsection,
			spec_input.urlPathnameSections,
			spec_input.parseLimit
		); 
		// run test cases
		expect(actual_output).toEqual(spec_output);


		// CASE6
		var spec_input  = spec.spec6.input;
		var spec_output = spec.spec6.output;
		var actual_output = Metadata.getSectionsList(
			spec_input.section,
			spec_input.subsection,
			spec_input.subsubsection,
			spec_input.urlPathnameSections,
			spec_input.parseLimit
		); 
		// run test cases
		expect(actual_output).toEqual(spec_output);

	});

	// TEST_SPEC_8
	it("Test getOmnitureCookie()", function() {
		// get test case data 
		var spec    		= require('../../../spec/ncg/test_data/libMetadata/spec8.js');
		var spec_output     = spec.output;
		
		// add cookies
		test_utils.addCookies(spec.cookies);
		var actual_output   = unescape(Metadata.getOmnitureCookie()); 
		// NOTE: here 'unescape' is required ONLY FOR TEST CASES as cookie.set function uses 'escape' for adding to cookie at client side

		// run test cases 
		expect(actual_output).toBe(spec_output);
		// remove cookies
		test_utils.removeCookies(spec.cookies);
	});

});