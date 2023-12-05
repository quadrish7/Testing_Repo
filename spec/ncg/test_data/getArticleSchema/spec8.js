var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
var meta_html = "";
	meta_html += '<meta name="article:section" content="TEST_DATA_section" />';
	meta_html += '<meta name="article:published_time" content="TEST_DATA_published_time" />';

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
			"article_published_time": "TEST_DATA_published_time",
			"content_type": "",
			"section": "section1",
			"subsection": "TEST_DATA_section",
			"subsubsection": "subsection2",
			"subsubsubsection": "subsubsection3",
			"subsubsubsubsection": "",
			"article_paid_content_type": ""
		}
	}
}