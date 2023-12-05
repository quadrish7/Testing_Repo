const BaseSchema = require("../baseschema");
const {getSectionsFromURL,ARTICLE_SCHEMA_URL} = require('./utils');

class NCAudienceSchema extends BaseSchema{
    constructor() {
        super();
    }

    getArticleSchema(){
		let schema = false;      
        let sectionsList = getSectionsFromURL();

    	 schema = {
			schema: ARTICLE_SCHEMA_URL,
			data: {
				"article_id": "",
				"article_source": "",
				"article_published_time": "",
				"content_type": "",
				"section": sectionsList[0] || "", 
				"subsection":  "",
				"subsubsection": "",
				"subsubsubsection": '',
				"subsubsubsubsection": '',
				"article_paid_content_type": ""
			}
		}
        return schema;
    }

    getAllSchemas(params){
        return [this.getAkaSchema(params),this.getArticleSchema(params),false,false]
    }
}

module.exports = new NCAudienceSchema;