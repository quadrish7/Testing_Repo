var schema_id = 'iglu:com.newscgp/relisting/jsonschema/1-0-0';

// meta tags data 
var article_id = "TEST_article.id";
var wsj_listing_location = "TEST_wsj-listing-location";
var wsj_listing_price = 100000;
var wsj_listing_status = "TEST_wsj-listing-status";
var wsj_listing_bed = 1000;
var wsj_listing_bath = 1500;

// html body elements data 
var price = 10000;

// ADDRESS testcase-1
var header = "21 E 61st St, New York, NY, United States";
// var header = "1901 Collins Avenue, Miami Beach, FL, United States";
// var header = "Dubai, Dubai, UAE, United Arab Emirates";
var address = {
	address: "21 E 61st St",
	city: "New York",
	state: "NY",
	postal_code: "",
	country: "United States"
};

/*

// ADDRESS testcase-2
var header = "Dubai Marina, Dubai, United Arab Emirates";
var address = {
	address: "",
	city: "Dubai Marina",
	state: "Dubai",
	postal_code: "",
	country: "United Arab Emirates"
};

// ADDRESS testcase-3
var header = "Port Andratx, 07157 - Spain";
var address = {
	address: "",
	city: "Port Andratx",
	state: "",
	postal_code: "07157",
	country: "Spain"
};

// ADDRESS testcase-4
var header = "Montecito, CA, 93108 - United States";
var address = {
	address: "",
	city: "Montecito",
	state: "CA",
	postal_code: "93108",
	country: "United States"
};

// ADDRESS testcase-5
var header = "Malmok, Aruba";
var address = {
	address: "",
	city: "Malmok",
	state: "",
	postal_code: "",
	country: "Aruba"
};

*/


// meta data 
var meta_html  = "";
	meta_html += '<meta name="article.id" content="'+article_id+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-location" content="'+wsj_listing_location+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-price" content="'+wsj_listing_price+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-status" content="'+wsj_listing_status+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-bed" content="'+wsj_listing_bed+'" />';
	meta_html += '<meta name="cXenseParse:wsj-listing-bath" content="'+wsj_listing_bath+'" />';

var body_html  = "";
	body_html += '<social-share-dropdown price="'+price+'" header="'+header+'">';
	body_html += '</social-share-dropdown>';


var output_price_value = "";
if(wsj_listing_price) {
	output_price_value = parseInt(wsj_listing_price, 10)/100;
} else if(price) {
	output_price_value = parseInt(price, 10)/100;
}


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