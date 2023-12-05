var cookieNamePattern = "AMCV\\_[A-Z0-9]+\\%40AdobeOrg";
var cookieName  = 'AMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg';
var cookieValue = "1999109931%7CMCMID%7C12967625007346180119015061762053624863%7CMCAAMLH-1501669246%7C8%7CMCAAMB-1501669246%7CNRX38WO0n5BH8Th-nqAG_A%7CMCAID%7CNONE";
module.exports = {
	input: cookieNamePattern,
	cookies: [
		['test1', 'value1'],
		[cookieName, cookieValue],
		['amcv_CB68E4BA55144CAA0A4C98A5%40AdobeOrg', "test12?&63"],
		['AAMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg', "anmfheppsfsf"],
		['AMCV_CB68E4BA55144CAA0A4C98A5%40AdobeOrg%akld', "asdgdagmfdheppsfsfsf"],
		['test2', 'value2']
	],
	output: cookieValue
}