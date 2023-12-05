const BaseSchema = require("../baseschema");
const {ARTICLE_SCHEMA_URL} = require('./utils');

class InvestorsSchema extends BaseSchema{
    constructor() {
        super();
    }
    /*
    article_id	InvestorsPermutiveData.article.id // Unavailable
    article_source	digitalData.authorName
    article_published_time	digitalData.articleDate
    content_type	digitalData.contentType
    section	digitalData.subSection1 || "" //Unavailable -> InvestorsPermutiveData.section
    subsection	digitalData.subSection2 || // Unavailable ->InvestorsPermutiveData.subsection
    subsubsection	digitalData.subSection3
    subsubsubsection	""
    subsubsubsection	""
    article_paid_content_type	digitalData.trialStatus
    */

    getArticleSchema(){
        let schema = {
            schema : ARTICLE_SCHEMA_URL,
            data :{

                "article_source": digitalData ? digitalData.authorName : "",
                "article_published_time": digitalData ? digitalData.articleDate : "",
                "content_type": digitalData ?  digitalData.contentType : "",
                "section": digitalData ?  digitalData.subSection1 :"",
                "subsection": digitalData ?  digitalData.subSection2 : "",
                "subsubsection": digitalData ? digitalData.pageName : "",
                "article_paid_content_type":  digitalData ? digitalData.trialStatus : "",
            }
        }
        return schema;
    }

    getAllSchemas(params){
        return [this.getAkaSchema(params),this.getArticleSchema(),false,false]
    }
}

module.exports = new InvestorsSchema;