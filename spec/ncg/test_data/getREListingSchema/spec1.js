var schema_id = 'iglu:com.newscgp/relisting/jsonschema/1-0-0';

// meta data 
var country_name = "TEST_country_name";
var meta_html = "";
	meta_html += '<meta name="og:country-name" content="'+country_name+'" />';

// window.MOVE_DATA.propertyDetails
var property_id = "TEST_property_id";
var listing_id = "TEST_listing_id";
var property_type = "TEST_property_type";
var lat = "";
var long = "";
var address = "TEST_address";
var city = "TEST_city";
var state_code = "TEST_state_code";
var postal_code = "TEST_postal_code";
var price = "";
var beds = "";
var baths = "";

// window.MOVE_DATA.adobeDTM 
var propertyType = "TEST_propertyType";

module.exports = {
	input: {
		"data": { // added to window.MOVE_DATA property
			"propertyDetails" : {
				"property_id": property_id,
				"listing_id": listing_id,
				"property_type": property_type,
				"lat": lat,
				"long": long,
				"address": address,
				"city": city,
				"state_code": state_code,
				"postal_code": postal_code,
				"price": price,
				"beds": beds,
				"baths": baths
			},
			"adobeDTM": {
				"propertyType": propertyType
			}
		},
		"metaHTML": meta_html
	},
	output: {
		"schema": schema_id,
		"data": {
			listing_property_id : (property_id || "") + "",
			listing_id: (listing_id || "") + "",
			listing_type: (property_type || ""),
			listing_location_lat: parseFloat(lat) || 0,
			listing_location_long: parseFloat(long) || 0,
			listing_location_address: address || "",
			listing_location_city: city || "",
			listing_location_state : state_code || "",
			listing_location_postcode: (postal_code || "") + "",
			listing_location_country: country_name || "",
			listing_property_type: propertyType || "",
			listing_price: parseInt(price) || 0,
			listing_bedrooms: parseInt(beds) || 0,
			listing_bathrooms: parseInt(baths) || 0
		}
	}
}