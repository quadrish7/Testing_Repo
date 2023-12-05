var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
var meta_html = "";
	meta_html += '<meta name="page.name" content="TEST_DATA_name_120350637637" />';
	meta_html += '<meta name="article:section" content="TEST_DATA_section" />';
	meta_html += '<meta name="page.subsection" content="TEST_DATA_subsection" />';
	meta_html += '<meta name="article:author" content="TEST_DATA_author" />';
	meta_html += '<meta name="article:published_time" content="TEST_DATA_published_time" />';
	meta_html += '<meta name="page.access" content="TEST_DATA_access" />';

module.exports = {
	input: {
		"schema": schema_id,
		"data": meta_html,
		"location.pathname": "/section1/subsection2/subsubsection3/subsubsubsection4/subsubsubsubsubsection5"
	},
	output: {
		"schema": schema_id,
		"data": {
			"article_id": "120350637637",
			"article_source": "TEST_DATA_author",
			"article_published_time": "TEST_DATA_published_time",
			"content_type": "",
			"section": "TEST_DATA_section",
			"subsection": "TEST_DATA_subsection",
			"subsubsection": "",
			"subsubsubsection": "",
			"subsubsubsubsection": "",
			"article_paid_content_type": "TEST_DATA_access"
		}
	}
}