var cookieName = "_ncg_sp_";
var cookieNameSuffix = '\\d[a-z][1-9]_9';
var cookieValue = "test_value_sp-2";
module.exports = {
	input: cookieName,
	inputSuffix: cookieNameSuffix,
	cookies: [
		['_ncg_sp_1A1_9', 'test_value_sp-1'],
		['_ncg_sp_1a5_9', cookieValue],
		['_ncg_sp_1a0_9', 'test_value_sp-3'],
		['_ncg_sp_ka9_9', 'test_value_sp-4']
	],
	output: cookieValue
}