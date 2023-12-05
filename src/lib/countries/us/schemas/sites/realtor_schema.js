const BaseSchema = require("../baseschema");
const {getSectionsFromURL,getMetadata,RELISTING_SCHEMA_URL,ARTICLE_SCHEMA_URL,RESEARCH_SCHEMA_URL,ADHOC_SCHEMA_URL} = require('./utils');

class RealtorSchema extends BaseSchema{
    constructor() {
        super();
    }
	/* this method is a fix to article id coverage issue, 
	since Realtor has commented "adobeDTM" on their site.
	*/
	getPostId(){
		try{
			let ele = document.querySelector("link[rel=shortlink]");
			let params = ele.href.split('?')[1];
			let postID = new URLSearchParams(params).get("p");
			return postID;
		}
		catch(e){
			return "";
		}

	}
    getArticleSchema(){
        let schema = false;
    	let urlSections = getSectionsFromURL(2);
		// let adobeDTM = window.MOVE_DATA ? window.MOVE_DATA.adobeDTM : {};

		schema = {
			schema: ARTICLE_SCHEMA_URL,
			data: {
				"article_id": this.getPostId() || "",
				"article_source": "",
				"article_published_time": getMetadata("article:published_time") || "",
				"content_type": getMetadata("og:type") || "",
				"section": (urlSections[0] || ""),
				"subsection": (urlSections[1] || ""), 
				"subsubsection": "", 
				"subsubsubsection": "",
				"subsubsubsubsection": "",
				"article_paid_content_type": ""
			}
		}
        return schema;
    }

    getRESearchSchemaSPA(params) {
		let schema = false;
		// SRP stands for Search Result Page
		if (window.kxdl && window.kxdl.page_type === 'SRP') {
				let location = "";
				location += (window.kxdl.citystsrch || "");
				location += " " + (window.kxdl.zipsearch || "");
				location += " " + (window.kxdl.countysrch || "");
				location = location.replace(/_+/g, ' ').replace(/ +/g, ' ').trim();
				schema = {
					schema: RESEARCH_SCHEMA_URL,
					data: {	
						"search_location": location,
						"search_type": (window.kxdl.tsrch || ""), 
						"search_beds_min": window.kxdl.bedsrch ? parseInt(window.kxdl.bedsrch) : 0,
						"search_beds_max": 0,
						"search_baths_min": window.kxdl.bathsrch ? parseInt(window.kxdl.bathsrch) : 0,
						"search_baths_max": 0,
						"search_property_type": (window.kxdl.ptsrch || ""),
						"search_price_min":window.kxdl.min ?  parseInt(window.kxdl.min) : 0,
						"search_price_max": window.kxdl.max ? parseInt(window.kxdl.max) : 0
					}
				};
		}
		return schema;
	}

	getREListingSchemaSPA(params) {
		let schema = false;
		// LDP stands for Listing Details Page.
		if (window.kxdl && window.kxdl.page_type === 'LDP') {
				schema = {
					schema: RELISTING_SCHEMA_URL,
					data: {
						listing_property_id : window.kxdl.mprid || "",
						listing_id: window.kxdl.mlid || "",
						listing_type: window.kxdl.tldp || "",
						listing_location_lat: window.kxdl.lat ? Number(window.kxdl.lat) : 0.0,
						listing_location_long: window.kxdl.lon ? Number(window.kxdl.lon) : 0.0,
						listing_location_address: (window.kxdl.address ? 
								window.kxdl.address.replace(/_+/g, ' ').replace(/ +/, ' ').trim() : ""),
						listing_location_city: (window.kxdl.cityldp ? 
								window.kxdl.cityldp.replace(/_+/g, ' ').replace(/ +/, ' ').trim() : "") ,
						listing_location_state : (window.kxdl.citystldp || ""),
						listing_location_postcode: (window.kxdl.zipldp || ""),
						listing_location_country: "",
						listing_property_type: (window.kxdl.ptldp || ""),
						listing_price: window.kxdl.listingprice ? parseInt(window.kxdl.listingprice) : 0,
						listing_bedrooms: window.kxdl.bedldp ? parseInt(window.kxdl.bedldp) : 0,
						listing_bathrooms: window.kxdl.bathldp ? parseInt(window.kxdl.bathldp) : 0
					}
				};
		}
		return schema;
	}

	getREAdhocSchema(params){
		let data = []; 
		
		for(let property in kxdl){
			let val = (kxdl[property]).toString();
			
			if(val.length > 255){
				val = val.slice(0,255);
			}
			
			if(val.toLowerCase()=== 'undefined'){
				kxdl[property] = ""
			}
			
			data.push({
				"key" : property,
				"value" : val
			});
		}
		
		return {
			schema : ADHOC_SCHEMA_URL,
			data : {
				namespace : 'realtor.adhocdata.v1',
				data : data
				}
			}
		}
		
    getAllSchemas(params){
        return [this.getAkaSchema(params),this.getArticleSchema(),this.getRESearchSchemaSPA(params),this.getREListingSchemaSPA(params),this.getREAdhocSchema(params)]
    }
}

module.exports = new RealtorSchema;