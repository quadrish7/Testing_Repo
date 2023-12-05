var cookie = require('./cookie');

var Metadata = function (params) {
	this.params = params;
}

Metadata.prototype = {

	getMetadata: function(key) {
		var el = document.querySelector('meta[name="' + key +'"]');
		if (!el) el = document.querySelector('meta[property="' + key +'"]');
		if (el) {
			return el.getAttribute('content');
		}
	},

	parseAddress: function(address) {
        // Address examples:
        // "21 E 61st St, New York, NY, United States"
        // "1901 Collins Avenue, Miami Beach, FL, United States"
        // "Dubai, Dubai, UAE, United Arab Emirates"
        // "Dubai Marina, Dubai, United Arab Emirates"
        // "Port Andratx, 07157 - Spain"
        // "Montecito, CA, 93108 - United States"
        // "Malmok, Aruba"
        var parts = address.split(",");
        var ret = {
            address: "",
            city: "",
            state: "",
            postal_code: "",
            country: ""
        };
        var country_zip = parts[parts.length-1].split("-");
        if (country_zip.length == 2) {
            ret.country = country_zip[1].trim();
            ret.postal_code = country_zip[0].trim();
        }
        else {
            ret.country = country_zip[0].trim();
        }
        if (parts.length == 1) {
            ret.address = parts[0].trim();
        }
        if (parts.length == 2) {
            ret.city = parts[0].trim();
        }
        if (parts.length == 3) {
            ret.city = parts[0].trim();
            ret.state = parts[1].trim();
        }
        if (parts.length > 3) {
            ret.state = parts[parts.length-2].trim();
            ret.city = parts[parts.length-3].trim();
            ret.address = "";
            for (i=0; i<parts.length-3; i++) {
                ret.address += parts[i] + " ";
            }
            ret.address = ret.address.trim();
        }
        return ret;
    },

    getSectionsFromURL: function(parseLimit) {

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
    },


    // section/subsection/subsubsection identification using various data sources with priority
        // 1 -> Use standard meta tags or window object based values FIRST(1) which are identified earlier and being used till now
        // 2 -> If no data is identified from (1), THEN(2) check for new meta tags of the page with names 'section', 'subsection', 'subsubsection'
        // 3 -> If no data is identified from (2), THEN(3) use values from URL pathname parsing to capture sections data
        // 4 -> SPECIAL conditions to check 
            // If any of the sections are identified in 1 or 2, step-3 should update its logic to provide section/subsection/subsubsection
            // Example: if 'section' is identified from meta tags, then url path name with /a/b/ matches to 'subsection' as 'a' and 'subsubsection' as 'b'
        // 5 -> Check for unassigned values and set an empty string 

        // use array.push method to handle ease creation of [section,subsection,subsection] array

     getSections: function(defaultValues,metaTagNames,urlData,parseLimit) {
        var sections = [],
            temp = [],
            urlIndex = 0,
            maxSections = parseLimit ? parseLimit : 3,
            self = this;

        // defaultValues = ['section-name','subsection-name','subsubsection-name'] OR ['section-name',undefined,..] OR [undefined,'subsection-name',...] OR [undefined,undefined,..]
        // metaTagNames  = ['section','subsection','subsubsection']
        // urlData       = [] OR ['section-name'] OR ["section-name",""] OR ['section-name','subsection-name'] OR ['section-name','subsection-name', '']

        sections = defaultValues.map(function(val,index) {
            // replace undefined defaultValues with metadata values using generic meta name values for sections
            return (!!val ? val : (self.getMetadata(metaTagNames[index]) || ""));

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
    },

    getSectionsList: function(section, subsection, subsubsection, sections, parseLimit) {
        return this.getSections(
            [section,subsection,subsubsection], // default meta tags or window object based sections data
            ["section","subsection","subsubsection"], // search for meta tags with these names to fill empty values of step-1
            [sections[0],sections[1],sections[2],sections[3]], // use URL sections data to fill empty values of step-1 and step-2
            parseLimit
        );
    },

    getOmnitureCookie: function() {
        // pattern structure : AMCV_$SITEHEX_CODE%40AdobeOrg
        var regexp = 'AMCV\\_[A-Z0-9]+\\%40AdobeOrg';
        var val = cookie.getCookieFromNamePattern(regexp);
        return val;
    }
}

module.exports =  new Metadata;