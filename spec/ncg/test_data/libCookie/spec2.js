var cookieNamePattern = "AMCV\\_[A-Z0-9]+\\%40AdobeOrg";
module.exports = {
	input: cookieNamePattern,
	cookies: [
		['test3', 'value3'],
		['TEST%AMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg', "test112q5"],
		['TEST_AMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg', "aa236test112q5"],
		['test4', 'value4'],
		['AMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg%TEST', "fn7baa236test112q5"],
		['test5', 'value5'],
		['AMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg_TEST', "fndbd457baa236test112q5"],
		['AMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg_AMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg', "sd578fn7baa236test112q5"],
		['amcv_CB68E4BA55144CAA0A4C98A5%40AdobeOrg', "sdgsdgu8568"],
		['AMCV_CB68E4BA55144CAA0A4C98A540AdobeOrg', "sgsg74588"],
		['AMCV_CB68E4BA55144CAA0A4C98A540Adobe', "sdg4e58585959"]
	],
	output: null
}