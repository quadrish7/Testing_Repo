const BaseSchema = require("../baseschema");
const {getSectionsFromURL,getSectionsList,getMetadata,getWindowUTagData,ARTICLE_SCHEMA_URL} = require('./utils');

class FnLondonSchema extends BaseSchema{
    constructor() {
        super();
    }

    getArticleSchema(){
        let schema = false;
        // sections
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
                "article_published_time": getWindowUTagData("article_publish") || getMetadata("article.published") || "",
                "content_type": getWindowUTagData("page_content_type") || getMetadata("page.content.type") || "",
                "section": sectionsList[0] || "",
                "subsection":  sectionsList[1] || "",
                "subsubsection": sectionsList[2] || "",
                "subsubsubsection": '',
                "subsubsubsubsection": '',
                "article_paid_content_type":  getWindowUTagData("page_access") || getMetadata("article.access") || ""
            }
        }
        
        return schema;
    }

    getAllSchemas(params){
        return [this.getAkaSchema(params),this.getArticleSchema(),false,false]
    }
}

module.exports = new FnLondonSchema;