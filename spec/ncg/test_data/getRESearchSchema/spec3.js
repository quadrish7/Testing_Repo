var schema_id = 'iglu:com.newscgp/research/jsonschema/1-0-0';

// window.adobeDTM.search
var search_city = "McLean";
var search_state = "VA";
var search_zip = "22101";
var search_care_types = "";

// set location string 
var location = "";
	location += search_city || "";
	location += " "+(search_state || "");
	location += " "+(search_zip || "");

module.exports = {
	input: {
		"data": { // added to window.adobeDTM property
			"search": {
				"city": search_city,
				"state": search_state,
				"zip": search_zip,
				"careTypes": search_care_types
			}
		}
	},
	output: {
		"schema": schema_id,
		"data": {
			"search_location": location.trim(),
			"search_type": "",
			"search_beds_min": 0,
			"search_beds_max": 0,
			"search_baths_min": 0,
			"search_baths_max": 0,
			"search_property_type": search_care_types || "",
			"search_price_min": 0,
			"search_price_max": 0
		}
	}
}