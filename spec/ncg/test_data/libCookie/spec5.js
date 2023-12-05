var cookieName = "_ncg_sp_static_";
var cookieNameSuffix = 'suffix_123_abcd_9';
var cookieValue = "test_value_sp-2_suffixed_cookie_value";
module.exports = {
	input: cookieName,
	inputSuffix: cookieNameSuffix,
	cookies: [
		['_ncg_sp_1A1_9_suffix_123_abcd_9', 'test_value_sp-1'],
		['_ncg_sp_static_suffix_123_abcd_9_', 'test_value_sp-2'],
		['_ncg_sp_static_suffix_123_abcd_9', cookieValue],
		['ancg_sp_static_suffix_123_abcd_9', 'test_value_sp-4']
	],
	output: cookieValue
}