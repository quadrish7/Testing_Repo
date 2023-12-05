const BaseSchema = require("../baseschema");
const {getSectionsFromURL,getSectionsList,getMetadata,getWindowUTagData,ARTICLE_SCHEMA_URL,RELISTING_SCHEMA_URL} = require('./utils');

// TODO: add Research(param)
class MansionGlobalSchema extends BaseSchema{
    constructor() {
        super();
    }

    getArticleSchema(){
        let schema = false;
        // sectionsi
        // - if section/subsection are undefined, then try to capture sections from other sources like generic meta tags, url pathname string
        let section = getWindowUTagData("page_section") || getMetadata("article.section") || getMetadata("page.section") || "";
        let subsection = getWindowUTagData("page_subsection") || getMetadata("article.page") || getMetadata("page.subsection") || "";
        let subsubsection = getWindowUTagData("article_type") || getMetadata("article.type") || "";
        let urlSections = getSectionsFromURL();
        let sectionsList = getSectionsList(section,subsection,subsubsection,urlSections);
        // article
        let article_id = getWindowUTagData("article_id") || getMetadata("article.id") || "";

        schema = {
            schema: ARTICLE_SCHEMA_URL,
            data: {
                "article_id": String(article_id),
                "article_source": getWindowUTagData("page_content_source") || getMetadata("page.content.source") || "",
                "article_published_time": getWindowUTagData("article_publish") || getMetadata("article.published") ||"",
                "content_type": getWindowUTagData("page_content_type") || getMetadata("page.content.type") ||"",
                "section": sectionsList[0] || "",
                "subsection": sectionsList[1] || "",
                "subsubsection": sectionsList[2] || "",
                "subsubsubsection": '',
                "subsubsubsubsection": '',
                "article_paid_content_type":  getWindowUTagData("page_access") || getMetadata("article.access") || ""
            }
        }
            
        return schema;
    }

    getReListingSchema(params){
                let schema = false;
				var listing = null;
				try{
					var pageName = utag_data.page_name.toLowerCase();
					listing = window.__STATE__.data[pageName].data.data.listing
				} catch(err) {
					return false;
				}

				schema =  {
					schema: RELISTING_SCHEMA_URL,
					data: {
						listing_property_id : (listing.id).toString(), // id is int, hence
						listing_id: (listing.id).toString(),
						listing_type: (listing.property_type || ""),
						listing_location_lat: (listing.geocoded_address && Number(listing.geocoded_address.lat))
								|| Number(listing.lat) || 0,
						listing_location_long: (listing.geocoded_address && Number(listing.geocoded_address.lng)) 
								|| Number(listing.lng) || 0,
						listing_location_address: (listing.address && listing.address.street_address1) || "",
						listing_location_city: (listing.address && listing.address.city) || "",
						listing_location_state: (listing.address && listing.address.state_code) || "",
						listing_location_postcode:  (listing.geocoded_address && listing.geocoded_address.postal_code) || "",
						listing_location_country: (listing.geocoded_address && listing.geocoded_address.country) || "",
						listing_property_type: (listing.property_type || ""),
						listing_price: (listing.price/100) || 0,
						listing_bedrooms: listing.bedrooms || 0,
						listing_bathrooms: listing.full_bathrooms || 0
					}
				};
            return schema;
    }

    getAllSchemas(params){
        return [this.getAkaSchema(params),this.getArticleSchema(),false,this.getReListingSchema(params)]
    }
}

module.exports = new MansionGlobalSchema;