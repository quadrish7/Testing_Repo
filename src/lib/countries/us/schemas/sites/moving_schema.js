const BaseSchema = require("../baseschema");
const {getSectionsFromURL,ARTICLE_SCHEMA_URL} = require('./utils');

class MovingSchema extends BaseSchema{
    constructor() {
        super();
    }

    getArticleSchema(params){
        let schema = false;      
    	let urlSections = getSectionsFromURL(2);

		schema = {
			schema: ARTICLE_SCHEMA_URL,
			data: {
				"article_id": "",
				"article_source": "",
				"article_published_time": "" ,
				"content_type": "",
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

    getAllSchemas(params){
        return [this.getAkaSchema(params),this.getArticleSchema(params),false,false]
    }
}

module.exports = new MovingSchema;