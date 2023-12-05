var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
var meta_html = "";
	meta_html += '<meta name="article:published_time" content="2017-07-24 05:30:39" />';


module.exports = {
	input: { // added to window.utag_data property
		"data": {			
			"nlm_recipe_id": "5741",
			"net_article_source": "nca",
			"net_sec1": "lifestyle",
			"net_sec2": "motoring",
			"net_sec3": "TEST_section3"
		},
		"metaHTML": meta_html
	},
	output: {
		"schema": schema_id,
		"data": {
			"article_id": "5741",
			"article_source": "nca",
			"article_published_time": "2017-07-24 05:30:39", 
			"content_type": "",
			"section":  "lifestyle",
			"subsection": "motoring",
			"subsubsection": "TEST_section3",
			"subsubsubsection": "",
			"subsubsubsubsection": "",
			"article_paid_content_type": ""
		}
	}
}