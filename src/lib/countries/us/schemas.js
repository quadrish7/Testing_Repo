var Metadata = require('../../metadata');
var RegionSchema = function (params) {
	this.params = params;
}

RegionSchema.prototype = {

	getAkaSchema: function(params) {
		var schema = {
			schema: 'iglu:com.newscgp/aka/jsonschema/1-0-0',
			data: {
				// User information
				user_id: params.user_id || '',
				user_provider: (params.user_id && params.user_provider) ? params.user_provider : '', // Eg: gygia | auth0
				user_memtype: params.user_memtype || '', // anonymous | subscriber | registered 
				// (default if not set is 'anonymous')
				// Newsletter subscriptions
				user_newsletter_id: params.user_newsletter_id || '',
				user_newsletter_provider: params.user_newsletter_provider || '', // Eg: SalesForce | MailChimp | CampaignMonitor

				// If your DMP creates a unique id
				// for this browser, enter it here.
				// If you use more than DMP, enter the details for your main one.
				browser_dmp_id: params.browser_dmp_id || '',
				browser_dmp_provider: params.browser_dmp_provider || '', // Eg: krux | bluekai

				// Ads PPID
				// If you send a Publisher Provided Id, or some other unique User Id
				// with your ads requests, please enter it here
				// PLEASE MAKE SURE THAT THIS ID IS TARGETABLE FOR AD SERVING.
				browser_ads_ppid: params.browser_ads_ppid || '', 
				browser_ads_provider: params.browser_ads_provider || '', // Eg: dfp 

				// If your Analytics platform creates a unique id
				// for this browser, enter it here.
				// If you use more than Analytics platform, enter the details for your main one.
				browser_analytics_id: params.browser_analytics_id || '', 
				browser_analytics_provider: params.browser_analytics_provider || '', // Eg: omniture | ga
				//                                                                                
				// Last, but not least, NCG Id
				browser_ncg_id: params.browser_ncg_id || ''                                                                
			}
		}
		return schema;
	},

	getArticleSchema: function(params) {
		/*
	    Website 1: wsj.com:
		<meta name="article.id" content="SB11663273350780754005304582325402391333104" />    
		<meta name="article.id" content="SB11541260633284334056504582327081179402066" />
		<meta name="article.section" content="Tech" />
		<meta name="article.section" content="Business" />
		<meta name="article.published" content="2016-09-20T11:43:00.000Z" />
		<meta name="article.published" content="2016-09-21T13:49:00.000Z" />
		<meta name="article.access" content="free" />
		<meta name="article.access" content="paid" />
		I am not sure about the following value.
		<meta name="page.content.source" content="PRO,WSJ-PRO-DEBT,WSJ-PRO-WSJ.com" />
		Following tags might be useful:
		<meta name="article.type" content="U.S. News" />
		<meta name="article.type" content="Business" />
		<meta name="article.page" content="US" />


	    Website 2: www.barrons.com/
		<meta name="article.id" content="SB52549412964588853471504582325823701939852" />
		<meta name="article.id" content="SB52799764070971553780204582297714139160138" />
		<meta name="article.section" content="Daily" />
		<meta name="article.section" content="Barrons Magazine" />
		<meta name="article.published" content="2016-09-20T20:35:00.000Z" />
		<meta name="article.published" content="2016-09-10T04:01:00.000Z" />
		<meta name="article.access" content="paid" />
		<meta name="article.access" content="paid" />
		I am not sure about the following value
		<meta name="page.content.source" content="Barron's Online" />
		Following tags might be useful:
		<meta name="article.type" content="Barron's Take" />
		<meta name="article.type" content="Follow Up" />
		<meta name="article.page" content="Daily" />

	    Website 4: efinancial news
		<meta property="article:published_time" content="2016-10-04" />
		<meta property="article:author" content="Dan Ivascyn" />
		<meta property="article:section" content="Asset Management" />
		<meta name="page.section" content="FNO_assetmanagement" />
		<meta name="page.category" content="Article" />
		<meta name="page.name" content="FNO_The future of bond markets – by Dan Ivascyn_4076290527" />
		<meta name="page.subsection" content="assetmanagement" />
		<meta name="page.access" content="free" />

	    Website 5: http://heatst.com/
		window.utag_data.article_id:"48046"
		window.utag_data.article_published:"2016-09-19T18:03:09.000Z"
		window.utag_data.page_section:WORLD
		window.utag_data.article_access : free
		I am not sure about the following value.
		window.utag_data.page_content_source : “Heat Street"

	    Website 6: nypost.com
		for article.id  use, 
		dataLayer.post_id or nypost_maropost_data. newsletter_id
		<meta name='parsely-metadata' content='{"post_id":"nypost-10413978"}' />
		dataLayer. publish_date and dataLayer.publish_time
		Only date available as meta property
		<meta property="article:published_time" content="2016-09-21T03:29:38+00:00" />
		Section available for nypost
		dataLayer.section : sports

	    Website 7: www.decider.com
		for article.id  use, 
		dataLayer.post_id or nypost_maropost_data. newsletter_id
		<meta name='parsely-metadata' content='{"post_id":"decider-116958"}' />
		dataLayer. publish_date and dataLayer.publish_time
		Only date available as meta property
		<meta property="article:published_time" content="2016-09-21T03:29:38+00:00" />
		dataLayer.section : decider (its incorrect value. For the webpages I visited, all had section as decider. Its website name)

	    Website 8: pagesix.com
		for article.id  use, 
		dataLayer.post_id or nypost_maropost_data. newsletter_id
		<meta name='parsely-metadata' content='{"post_id":"pagesix-4147894"}' />
		dataLayer. publish_date and dataLayer.publish_time
		Only date available as meta property
		<meta property="article:published_time" content="2016-09-21T03:29:38+00:00" />
		dataLayer.section : pagesix (its incorrect value. For the webpages I visited, all had section as pagesix. Its website name)

		Website 9: realtor.com
		data: {
			"article_id": NO MAP exist,
			"article_source": NO MAP exist,
			"article_published_time": MAPPED to meta tag with property="article:published_time"
			"section": MAPPED to page url and exact value extracted from url path,
			"subsection": MAPPED to meta tag with property="article:section",
			"subsubsection": "",
			"article_paid_content_type": ""
		}
		*/

		var schema = false;
		var article_id = false;
		var urlSections = [];
		var section = "";
		var subsection = "";
		var subsubsection = "";
		var author = "";
		var sectionsList = [];

		// Realtor
		if (this.isRealtor() 
				&& window.MOVE_DATA 
				&& window.MOVE_DATA.adobeDTM 
				&& window.MOVE_DATA.adobeDTM.postID) {
		
				var urlSections = Metadata.getSectionsFromURL(2);
			
				return {
					schema: 'iglu:com.newscgp/article/jsonschema/1-0-0',
					data: {
						"article_id": window.MOVE_DATA.adobeDTM.postID || "",
						"article_source": "",
						"article_published_time": window.MOVE_DATA.adobeDTM.articleDate || "",
						"content_type": window.MOVE_DATA.adobeDTM.pageType || "",
						"section": window.MOVE_DATA.adobeDTM.top_category || (urlSections[0] || ""),
						"subsection": window.MOVE_DATA.adobeDTM.category || (urlSections[1] || ""), 
						"subsubsection": "", 
						"subsubsubsection": "",
						"subsubsubsubsection": "",
						"article_paid_content_type": ""
					}
				};
		} 

		if (article_id = Metadata.getMetadata("article.id")) {
			// DowJones sites: wsj, barrons, marketwatch - article
			// - get sections
			section = Metadata.getMetadata("article.section");
			subsection = Metadata.getMetadata("article.page");
			subsubsection = Metadata.getMetadata("article.type");
			// - if section/subsection are undefined, then try to capture sections from other sources like generic meta tags, url pathname string
			urlSections = Metadata.getSectionsFromURL();
			sectionsList = Metadata.getSectionsList(section,subsection,subsubsection,urlSections);

			// - set schema
			schema = {
				schema: 'iglu:com.newscgp/article/jsonschema/1-0-0',
				data: {
					"article_id": article_id + "",
					"article_source": Metadata.getMetadata("page.content.source") || "",
					"article_published_time": Metadata.getMetadata("article.published") || "",
					"content_type": "",
					"section": sectionsList[0] || "", //Metadata.getMetadata("article.section") || this.getTopSectionFromURL(),
					"subsection": sectionsList[1] || "", //Metadata.getMetadata("article.type") || "",
					"subsubsection": sectionsList[2] || "", //Metadata.getMetadata("article.page") || "",
					"subsubsubsection": '',
					"subsubsubsubsection": '',
					"article_paid_content_type": Metadata.getMetadata("article.access") || ""
				}
			}
		}
		else if (section = Metadata.getMetadata("page.section")) {
			// DowJones sites: wsj, barrons, marketwatch, efinancialnews - index
			// - get sections 
			section = Metadata.getMetadata("page.section");
			subsection = Metadata.getMetadata("page.subsection");
			subsubsection = "";
			// - if section/subsection are undefined, then try to capture sections from other sources like generic meta tags, url pathname string
			urlSections = Metadata.getSectionsFromURL();
			sectionsList = Metadata.getSectionsList(section,subsection,subsubsection,urlSections);

			// - set schema
			schema = {
				schema: 'iglu:com.newscgp/article/jsonschema/1-0-0',
				data: {
					"article_id": "",
					"article_source": "",
					"article_published_time": "",
					"content_type": "",
					"section": sectionsList[0] || "", //section,
					"subsection":  sectionsList[1] || "", //Metadata.getMetadata("page.subsection") || "",
					"subsubsection": subsubsection, //"",
					"subsubsubsection": '',
					"subsubsubsubsection": '',
					"article_paid_content_type": ""
				}
			}
		}
		else if (window.utag_data && window.utag_data.article_id) {
			
			// HeatSt, thesun.co.uk,
			// - get sections
			section = window.utag_data.page_section;
			subsection = "";
			subsubsection = "";
			// - if section/subsection are undefined, then try to capture sections from other sources like generic meta tags, url pathname string
			urlSections = Metadata.getSectionsFromURL();
			sectionsList = Metadata.getSectionsList(section,subsection,subsubsection,urlSections);

			// - set schema
			schema = {
				schema: 'iglu:com.newscgp/article/jsonschema/1-0-0',
				data: {
					"article_id": window.utag_data.article_id + "",
					"article_source": window.utag_data.page_content_source,
					"article_published_time": window.utag_data.article_published || "",
					"content_type": "",
					"section": sectionsList[0] || "", //window.utag_data.page_section || this.getTopSectionFromURL(),
					"subsection":  sectionsList[1] || "", //"",
					"subsubsection": subsubsection, //"",
					"subsubsubsection": '',
					"subsubsubsubsection": '',
					"article_paid_content_type": window.utag_data.article_access
				}
			}
		} 
		else if (Array.isArray(window.dataLayer)) {
			// nypost, pagesix, decider
			// TODO: fix, it gets triggered even on realtor.com
			var matchIdx = -1;
			for(var i=0; i < window.dataLayer.length; i++) {
				if (dataLayer[i].post_id || dataLayer[i].section) {
							matchIdx = i;
							break;
				}
			}
			// no valid data is found
			if (matchIdx == -1) return false;

			
			var dateTime = (dataLayer[matchIdx].publish_date || "") + " " + (dataLayer[matchIdx].publish_time || "");
			// - get sections
			section = (dataLayer[matchIdx].section || "");
			subsection = (dataLayer[matchIdx].primary_tag || "");
			subsubsection = "";
			// - if section/subsection are undefined, then try to capture sections from other sources like generic meta tags, url pathname string
			urlSections = Metadata.getSectionsFromURL(3);
			sectionsList = Metadata.getSectionsList(section,subsection,subsubsection,urlSections);
			author = ( (dataLayer[matchIdx].byline && dataLayer[matchIdx].byline[0]) || "");

			// - set schema
			schema = {
				schema: 'iglu:com.newscgp/article/jsonschema/1-0-0',
				data: {
					"article_id": (window.dataLayer[matchIdx].post_id || "").toString(), // post_id is long hence
					"article_source": author,
					"article_published_time": dateTime.trim(),
					"content_type": "",
					"section": (sectionsList[0] || ""), 
					"subsection": (sectionsList[1] || ""), 
					"subsubsection": (sectionsList[2] || ""), 
					"subsubsubsection": '',
					"subsubsubsubsection": '',
					"article_paid_content_type": ""
				}
			}  
		}
		else if ((page_name = Metadata.getMetadata("page.name")) && (matches = page_name.match(/_([0-9]+)$/))) {
			// efinancialnews
			var article_id = matches[1];
			// - get sections
			section = Metadata.getMetadata("article:section");
			subsection = Metadata.getMetadata("page.subsection");
			subsubsection = "";
			// - if section/subsection are undefined, then try to capture sections from other sources like generic meta tags, url pathname string
			urlSections = Metadata.getSectionsFromURL();
			sectionsList = Metadata.getSectionsList(section,subsection,subsubsection,urlSections);

			// - set schema 
			schema = {
				schema: 'iglu:com.newscgp/article/jsonschema/1-0-0',
				data: {
					"article_id": article_id + "",
					"article_source": Metadata.getMetadata("article:author") || "",
					"article_published_time": Metadata.getMetadata("article:published_time") || "",
					"content_type": "",
					"section": sectionsList[0] || "", //Metadata.getMetadata("article:section") || this.getTopSectionFromURL(),
					"subsection": sectionsList[1] || "", //Metadata.getMetadata("page.subsection") || "",
					"subsubsection": subsubsection, //"",
					"subsubsubsection": '',
					"subsubsubsubsection": '',
					"article_paid_content_type": Metadata.getMetadata("page.access") || ""
				}
			}  
		}
		else {
			// realtor.com
			// moved up for the time being..
		}
		return schema;
	},

/*	getTopSectionFromURL: function() {
		// Just try to grab the top section from the URL
		var parts = document.location.pathname.split("/");
		// Make sure the first part is not a number or a date.
		if (parts[1] && !parts[1].match('^[0-9-]+$')) {
			return parts[1];
		}
		return "";
	},
*/

	isRealtor: function() {
		var host = document.location.host || "";
		var REALTOR = "realtor.com";
		if ( (host.length == REALTOR.length && host === REALTOR) ||
				(host.length > REALTOR.length && host.endsWith("."+REALTOR) ) ) {
					return true;
		}
		return false;
	},

	/**
	 * check if req is from a specifc domain
	 * @param {*} domain - should not contain leading '.'
	 */
	isFromDomain: function(domain){
		var host = document.location.host || "";
		if ( (host.length == domain.length && host === domain) ||
				(host.length > domain.length && host.endsWith("."+domain) ) ) {
					return true;
		}
		return false;
	},

	/** search schema from SPA implementation of Realtor(new) */
	getRESearchSchemaSPA: function(params) {
		var schema = false;
		if (this.isRealtor() && window.kxdl 
			&& window.prebidSection === 'SRP') {
				var location = "";
				location += (window.kxdl.citystsrch || "");
				location += " " + (window.kxdl.zipsrch || "");
				location += " " + (window.kxdl.countysrch || "");
				location = location.replace(/_+/g, ' ').replace(/ +/g, ' ').trim();
				schema = {
					schema: 'iglu:com.newscgp/research/jsonschema/1-0-0',
					data: {
						"search_location": location,
						"search_type": (window.kxdl.tsrch || ""), 
						"search_beds_min": (window.kxdl.bedsrch ? parseInt(window.kxdl.bedsrch) : 0),
						"search_beds_max": 0,
						"search_baths_min": (window.kxdl.bathsrch ? parseInt(window.kxdl.bathsrch) : 0),
						"search_baths_max": 0,
						"search_property_type": (window.kxdl.ptsrch || ""),
						"search_price_min": (parseInt(window.kxdl.min) || 0),
						"search_price_max": (parseInt(window.kxdl.max) || 0)
					}
				};
		}
		return schema;
	},

	getREListingSchemaSPA: function(params) {
		var schema = false;
		if (this.isRealtor() && window.kxdl 
			&& window.prebidSection === 'LDP') {
				schema = {
					schema: 'iglu:com.newscgp/relisting/jsonschema/1-0-0',
					data: {
						listing_property_id : (window.kxdl.mprid || ""),
						listing_id: (window.kxdl.mlid || ""),
						listing_type: (window.kxdl.status || ""),
						listing_location_lat: 0,
						listing_location_long: 0,
						listing_location_address: (window.kxdl.address ? 
								window.kxdl.address.replace(/_+/g, ' ').replace(/ +/, ' ').trim() : ""),
						listing_location_city: (window.kxdl.cityldp ? 
								window.kxdl.cityldp.replace(/_+/g, ' ').replace(/ +/, ' ').trim() : "") ,
						listing_location_state : (window.kxdl.st || ""),
						listing_location_postcode: (window.kxdl.zipldp || ""),
						listing_location_country: "",
						listing_property_type: (window.kxdl.ptldp || ""),
						listing_price: (parseInt(window.kxdl.listingprice) || 0),
						listing_bedrooms: (parseInt(window.kxdl.bedldp) || 0),
						listing_bathrooms: (parseInt(window.kxdl.bathldp) || 0)
					}
				};
		}
		return schema;
	},

	getMansionGlobalListingSchema: function(params) {
		if (this.isFromDomain("mansionglobal.com")) {
				var listing = null;
				try{
					var pageName = utag_data.page_name.toLowerCase();
					listing = window.__STATE__.data[pageName].data.data.listing
				} catch(err) {
					return false;
				}

				return {
					schema: 'iglu:com.newscgp/relisting/jsonschema/1-0-0',
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
		}
		return false;
	},

	getAllSchemas: function (params) {
		var schemas = [];
		schemas.push(this.getAkaSchema(params));
		schemas.push(this.getArticleSchema(params));
		schemas.push(this.getRESearchSchemaSPA(params));
		schemas.push(this.getREListingSchemaSPA(params) || this.getMansionGlobalListingSchema(params));
		return schemas;
	}

}


module.exports = new RegionSchema;

