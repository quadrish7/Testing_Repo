var schema_id = 'iglu:com.newscgp/research/jsonschema/1-0-0';

// window.MOVE_DATA.adobeDTM
var searchStreet = null;
var searchCity = "McLean";
var searchState = "VA";
var searchZip = "22101";
var searchCounty = "Fairfax";
var propertyStatus = "for_rent";
var searchPropertyType = "single_family";

// window.MOVE_DATA.facets
var beds_min  = "2";
var baths_min = "3";
var prop_type = "single-family-home";	
var price_min = "1500";
var price_max = "3750";

// set location string 
var location = "";
	location += searchStreet || "";
	location += " "+(searchCity || "");
	location += " "+(searchState || "");
	location += " "+(searchZip || "");
	location += " "+(searchCounty || "");

module.exports = {
	input: {
		"data": { // added to window.MOVE_DATA property
			"adobeDTM": {				
				"searchStreet": searchStreet,
				"searchCity": searchCity,
				"searchState": searchState,
				"searchZip": searchZip,
				"searchCounty": searchCounty,
				"propertyStatus": propertyStatus,
				"searchPropertyType": searchPropertyType
			},
			"facets": {
				"beds_min": beds_min,
				"baths_min": baths_min,
				"prop_type": prop_type,	
				"price_min": price_min,
				"price_max": price_max
			}
		}
	},
	output: {
		"schema": schema_id,
		"data": {
			"search_location": location.trim(),
			"search_type": propertyStatus || "",
			"search_beds_min": parseInt(beds_min) || 0,
			"search_beds_max": 0,
			"search_baths_min": parseInt(baths_min) || 0,
			"search_baths_max": 0,
			"search_property_type": prop_type || searchPropertyType || "",
			"search_price_min": parseInt(price_min) || 0,
			"search_price_max": parseInt(price_max) || 0
		}
	}
}