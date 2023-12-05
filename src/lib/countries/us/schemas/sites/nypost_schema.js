const BaseSchema = require('../baseschema');
const {getSectionsFromURL,getSectionsList,getMetadata,ARTICLE_SCHEMA_URL} = require('./utils');

class NYPostSchema extends BaseSchema {
    constructor(){
        super();
    }

    getArticleSchema(){
        let schema = false;
        if(Array.isArray(window.dataLayer)){
                let urlSections = [];
                let section = "";
                let subsection = "";
                let subsubsection = "";
                let author = "";
                let sectionsList = [];
                // TODO: fix, it gets triggered even on realtor.com
                let matchIdx = -1;
                for(let i=0; i < window.dataLayer.length; i++) {
                    if (dataLayer[i].post_id || dataLayer[i].section) {
                                matchIdx = i;
                                break;
                    }
                }
                // no valid data is found
                // no predefined data from BU
                // for /section page we can get sections context from generic meta tags, url pathname
                urlSections = getSectionsFromURL(3);
                if (matchIdx == -1 && urlSections.length < 1) // check's whether home/section page, return if home page
                    return false;
                
                let dataContextObj = dataLayer[matchIdx];
                let dateTime = ((dataContextObj && dataContextObj.publish_date) || "") + " " + ((dataContextObj && dataContextObj.publish_time) || getMetadata("article:published_time")||"");
                // - get sections
                section = ((dataContextObj && dataContextObj.section) || "");
                subsection = ((dataContextObj && dataContextObj.primary_tag) || "");
                subsubsection = "";
                // - if section/subsection are undefined, then try to capture sections from other sources like generic meta tags, url pathname string
               
                urlSections = getSectionsFromURL(3);
                sectionsList =getSectionsList(section,subsection,subsubsection,urlSections);
                author = ( (dataContextObj && dataContextObj.byline && dataContextObj.byline[0]) || "");
                // Test : sectionList[1] represents subsection, if subsection is missing then capture from meta tags like og:jetpack
                if(!sectionsList[1] && urlSections.length > 1){
                    try {
                        sectionsList[1] = getMetadata("og:description") ? getMetadata("og:description").split('|')[0].trim() : "";
                    } catch (error) {

                    }
                }
                // - set schema
                schema = {
                    schema: ARTICLE_SCHEMA_URL,
                    data: {
                        "article_id": ((dataContextObj && dataContextObj.post_id) || "").toString(), // post_id is long hence
                        "article_source": author,
                        "article_published_time": dateTime.trim(),
                        "content_type": getMetadata("og:type")||"",
                        "section":  sectionsList[0] || "", 
                        "subsection":  sectionsList[1] || "", 
                        "subsubsection":  sectionsList[2] || "", 
                        "subsubsubsection":  "",
                        "subsubsubsubsection":  "",
                        "article_paid_content_type":  ""
                    }
                }
        }   
        else if(window.dataLayer.app_id == 'FBIA'){
            schema = {
                schema: ARTICLE_SCHEMA_URL,
                data: {
                    "article_id": window.dataLayer.article_id ||"" ,
                    "article_source": window.dataLayer.article_source ||"",
                    "article_published_time": window.dataLayer.article_published_time || "",
                    "content_type": window.dataLayer.content_type ||"",
                    "section": window.dataLayer.section || "", 
                    "subsection": window.dataLayer.subsection || "", 
                    "subsubsection": window.dataLayer.subsubsection  || "", 
                    "subsubsubsection": window.dataLayer.subsubsubsection || "",
                    "subsubsubsubsection": window.dataLayer.subsubsubsubsection || "",
                    "article_paid_content_type": window.dataLayer.article_paid_content_type || ""
                }
            }
        }
        return schema;
    }

    getAllSchemas(params){
        return [this.getAkaSchema(params),this.getArticleSchema(),false,false]
    }
}

module.exports = new NYPostSchema;