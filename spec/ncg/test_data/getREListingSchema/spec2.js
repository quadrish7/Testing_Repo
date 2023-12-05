var schema_id = 'iglu:com.newscgp/relisting/jsonschema/1-0-0';

// window.adobeDTM.listing
var communityID = "TEST_communityID";
var managementID = "TEST_managementID";
var careTypes = "TEST_careTypes";
var city = "TEST_city";
var state = "TEST_state";
var zip = "TEST_zip";
var country = "USA";

module.exports = {
	input: {
		"data": { // added to window.adobeDTM property
			"listing" : {
				"communityID": communityID,
				"managementID": managementID,
				"careTypes": careTypes,
				"city": city,
				"state": state,
				"zip": zip
			}
		}
	},
	output: {
		"schema": schema_id,
		"data": {
			listing_property_id : (communityID || "") + "",
			listing_id: (managementID || "") + "",
			listing_type: careTypes || "",
			listing_location_lat: 0,
			listing_location_long: 0,
			listing_location_address: "",
			listing_location_city: city || "",
			listing_location_state : state || "",
			listing_location_postcode: (zip || "") + "",
			listing_location_country: country,
			listing_property_type: "",
			listing_price: 0,
			listing_bedrooms: 0,
			listing_bathrooms: 0
		}
	}
}