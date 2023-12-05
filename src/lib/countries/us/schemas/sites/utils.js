const AKA_SCHEMA_URL = 'iglu:com.newscgp/aka/jsonschema/1-0-0';
const ARTICLE_SCHEMA_URL = 'iglu:com.newscgp/article/jsonschema/1-0-0'; 
const RELISTING_SCHEMA_URL = 'iglu:com.newscgp/relisting/jsonschema/1-0-0';
const RESEARCH_SCHEMA_URL = 'iglu:com.newscgp/research/jsonschema/1-0-0';
const ADHOC_SCHEMA_URL = 'iglu:com.newscgp/adhoc/jsonschema/1-0-0';

function getMetadata(key){
    var el = document.querySelector('meta[name="' + key +'"]');
		if (!el) el = document.querySelector('meta[property="' + key +'"]');
		if (el) {
			return el.getAttribute('content');
		}
}
//utag_data(Universal Data Object)
function getWindowUTagData(prop){
    return (window.utag_data && window.utag_data[prop]) || false;
}

// refer NewsUK for this method
// return section values from string using params
function fetchSection(string,separator,index){
    return string ? string.split(separator)[index-1] : "";
}
function validateHost(domain){
    return document.location.host.endsWith(domain) || false;
}
function getSectionsFromURL(parseLimit) {

    // during karma test process, capture url pathname string value from special window key property available for ncg unit tests only.
    var urlPathname = window.__karma__ ? ((window._ncg_kjut && window._ncg_kjut['location.pathname'])||"") : document.location.pathname;
    var maxSections = parseLimit ? parseLimit : 2;
    
    // extract path from page URL like "/a/b/c" from "http://test.com/a/b/c?p1=3ab&p2=test"
    var parts = urlPathname.split("/"),
        sections = [];

    // Make sure the first part is not a number or part of date like yyyy/mm/dd.
    if (parts[1] && !parts[1].match('^[0-9-]+$')) {
        sections = parts.slice(1).map(function(section) {
            // ignore the names which are numbes only i.e "2007" or "06" or "2001-02" are ignored and filled with "" string in sections array, 
            // however "3-bedrooms...", "2-books...." kind of names are considered as valid names
            return section.match(/^[0-9-]+$/)===null ? section : "";
        }).slice(0,maxSections).concat(""); 
        // currently consider only upto 2 default values from url pathname data i.e 'section' and 'subsection'
        // OR specify the explicit parse limit using parseLimit parameter
    }

    // return 
    return sections;
}

function getSectionsList(section, subsection, subsubsection, sections, parseLimit) {
    return getSections(
        [section,subsection,subsubsection], // default meta tags or window object based sections data
        ["section","subsection","subsubsection"], // search for meta tags with these names to fill empty values of step-1
        [sections[0],sections[1],sections[2],sections[3]], // use URL sections data to fill empty values of step-1 and step-2
        parseLimit
    );
}

function getSections(defaultValues,metaTagNames,urlData,parseLimit) {
    var sections = [],
        temp = [],
        urlIndex = 0,
        maxSections = parseLimit ? parseLimit : 3,


    // defaultValues = ['section-name','subsection-name','subsubsection-name'] OR ['section-name',undefined,..] OR [undefined,'subsection-name',...] OR [undefined,undefined,..]
    // metaTagNames  = ['section','subsection','subsubsection']
    // urlData       = [] OR ['section-name'] OR ["section-name",""] OR ['section-name','subsection-name'] OR ['section-name','subsection-name', '']

    sections = defaultValues.map(function(val,index) {
        // replace undefined defaultValues with metadata values using generic meta name values for sections
        return (!!val ? val : (getMetadata(metaTagNames[index]) || ""));

    }).map(function(val,index) {
        // replace any empty strings from previous step1 with urlData array values
        return (!!val ? val : (urlData[urlIndex++] || ""));

    }).concat(
        // append any unused values left in urlData array in previous step2. This unused values helps in next step.
        urlData.slice(urlIndex)

    ).filter(function(val,index) { 
        // remove duplicate values if same values captured from meta tags, window object, url pathname string
        // the unused values from previous step3 will fill any duplicate values removed in this last step
        return (!!val && temp.indexOf(val.toLowerCase())===-1 ? (temp.push(val.toLowerCase()) && val) : "");

    }).slice(0,maxSections);

    // return
    return sections;
};

exports.AKA_SCHEMA_URL =AKA_SCHEMA_URL;
exports.ARTICLE_SCHEMA_URL = ARTICLE_SCHEMA_URL;
exports.getMetadata = getMetadata;
exports.getSectionsFromURL = getSectionsFromURL;
exports.getSectionsList = getSectionsList;
exports.getSections = getSections;
exports.RELISTING_SCHEMA_URL = RELISTING_SCHEMA_URL;
exports.RESEARCH_SCHEMA_URL = RESEARCH_SCHEMA_URL;
exports.getWindowUTagData = getWindowUTagData;
exports.validateHost = validateHost;
exports.fetchSection = fetchSection;
exports.ADHOC_SCHEMA_URL = ADHOC_SCHEMA_URL;