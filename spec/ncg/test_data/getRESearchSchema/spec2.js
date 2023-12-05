var schema_id = 'iglu:com.newscgp/research/jsonschema/1-0-0';

// window.MOVE_DATA.adobeDTM
var searchType = "zip_code";
var searchStreet = null;
var searchCity = "McLean";
var searchState = "VA";
var searchZip = "22101";
var searchCounty = "Fairfax";
var propertyStatus = "for_rent";
var searchPropertyType = "single_family";
var searchBedrooms = "2";
var searchBathrooms = "1";
var searchMinPrice = "1500";
var searchMaxPrice = "2500";

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
				"searchType": searchType,
				"searchStreet": searchStreet,
				"searchCity": searchCity,
				"searchState": searchState,
				"searchZip": searchZip,
				"searchCounty": searchCounty,
				"propertyStatus": propertyStatus,
				"searchPropertyType": searchPropertyType,
				"searchBedrooms": searchBedrooms,
				"searchBathrooms": searchBathrooms,
				"searchMinPrice": searchMinPrice,
				"searchMaxPrice": searchMaxPrice
			}
		}
	},
	output: {
		"schema": schema_id,
		"data": {
			"search_location": location.trim(),
			"search_type": propertyStatus || "",
			"search_beds_min": parseInt(searchBedrooms) || 0,
			"search_beds_max": 0,
			"search_baths_min": parseInt(searchBathrooms) || 0,
			"search_baths_max": 0,
			"search_property_type": searchPropertyType || "",
			"search_price_min": parseInt(searchMinPrice) || 0,
			"search_price_max": parseInt(searchMaxPrice) || 0
		}
	}
}