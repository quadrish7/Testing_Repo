var schema_id = 'iglu:com.newscgp/relisting/jsonschema/1-0-0';

// meta tags data 
var article_id = "TEST_article.id";
var wsj_listing_location = "TEST_wsj-listing-location";
var wsj_listing_price = 100000;
var wsj_listing_status = "TEST_wsj-listing-status";
var wsj_listing_bed = 1000;
var wsj_listing_bath = 1500;
var address = {
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: ""
};

// meta data 
var meta_html  = "";
	meta_html += '<meta name="article.id" content="'+article_id+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-location" content="'+wsj_listing_location+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-price" content="'+wsj_listing_price+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-status" content="'+wsj_listing_status+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-bed" content="'+wsj_listing_bed+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-bath" content="'+wsj_listing_bath+'" />';

var body_html  = "";
var output_price_value = parseInt(wsj_listing_price, 10)/100;


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