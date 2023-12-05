var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
var meta_html = "";
	meta_html += '<meta name="page.section" content="Business" />';
	meta_html += '<meta name="page.subsection" content="U.S. News" />';

module.exports = {
	input: {
		"schema": schema_id,
		"data": meta_html,
		"location.pathname": "/section1/subsection2/subsubsection3/subsubsubsection4/subsubsubsubsubsection5"
	},
	output: {
		"schema": schema_id,
		"data": {
			"article_id": "",
			"article_source": "",
			"article_published_time": "",
			"content_type": "",
			"section": "Business",
			"subsection": "U.S. News",
			"subsubsection": "",
			"subsubsubsection": "",
			"subsubsubsubsection": "",
			"article_paid_content_type": ""
		}
	}
}