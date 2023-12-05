var schema_id = 'iglu:com.newscgp/relisting/jsonschema/1-0-0';

// meta tags data 
var article_id = "";
var wsj_listing_status = "";
var wsj_listing_bed = 0;
var wsj_listing_bath = 0;

// html body elements data 
var price = 10000;

// ADDRESS
var header = "Montecito, CA, 93108 - United States";
var address = {
	address: "",
	city: "Montecito",
	state: "CA",
	postal_code: "93108",
	country: "United States"
};


// meta data 
var meta_html  = "";

var body_html  = "";
	body_html += '<social-share-dropdown price="'+price+'" header="'+header+'">';
	body_html += '</social-share-dropdown>';

var output_price_value = parseInt(price, 10)/100;


module.exports = {
	input: {
		"data": {
		},
		"metaHTML": meta_html,
		"bodyHTML": body_html
	},
	output: {
		"schema": schema_id,
		"data": {
			listing_property_id : article_id,
			listing_id: "",
			listing_type: wsj_listing_status,
			listing_location_lat: 0,
			listing_location_long: 0,
			listing_location_address: address.address,
			listing_location_city: address.city,
			listing_location_state : address.state,
			listing_location_postcode: address.postal_code,
			listing_location_country: address.country,
			listing_property_type: "",
			listing_price: parseInt(output_price_value),
			listing_bedrooms: wsj_listing_bed,
			listing_bathrooms: wsj_listing_bath
		}
	}
}