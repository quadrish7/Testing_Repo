const BaseSchema = require('../baseschema');
const {getSectionsFromURL,getSectionsList,ARTICLE_SCHEMA_URL, getWindowUTagData} = require('./utils');

class TheTimesSchema extends BaseSchema {
    constructor(){
        super();
    }

    getArticleSchema(){
        let schema = false;
		let article_id = getWindowUTagData('article_id') || "";

			// - get sections
			// page_section_hierarchy help fetching section value from page last-six-days
			let sectionVals = getWindowUTagData("page_section_hierarchy") ? getWindowUTagData("page_section_hierarchy").split("|") : [];

			let section = getWindowUTagData("page_section") || sectionVals[0] || "";
			let subsection = getWindowUTagData("attrs").label || sectionVals[1] || "";
			let subsubsection = sectionVals[2] || "";
			// - if section/subsection are undefined, then try to capture sections from other sources like generic meta tags, url pathname string
			let urlSections = getSectionsFromURL();
			let sectionsList = getSectionsList(section,subsection,subsubsection,urlSections);
			// - set schema
			schema = {
				schema: ARTICLE_SCHEMA_URL,
				data: {
					"article_id": String(article_id),
					"article_source": "",
					"article_published_time": getWindowUTagData("article_publish_timestamp") || "",
					"content_type": getWindowUTagData("page_type") || "",
					"section": sectionsList[0] || "",
					"subsection":  sectionsList[1] || "",
					"subsubsection": sectionsList[2] || "",
					"subsubsubsection": '',
					"subsubsubsubsection": '',
					"article_paid_content_type":  getWindowUTagData("page_restrictions") || ""
				}
			}

        return schema;
    }

    getAllSchemas(params){
        return [this.getAkaSchema(params),this.getArticleSchema(),false,false]
    }
}

module.exports = new TheTimesSchema;
