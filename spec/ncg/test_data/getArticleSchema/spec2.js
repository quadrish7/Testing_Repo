var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
var meta_html = "";
	meta_html += '<meta name="article.id" content="SB11663273350780754005304582325402391333104" />';
	meta_html += '<meta name="article.published" content="2016-09-21T13:49:00.000Z" />';
	meta_html += '<meta name="article.section" content="Business" />';
	meta_html += '<meta name="article.access" content="paid" />';

module.exports = {
	input: {
		"schema": schema_id,
		"data": meta_html,
		"location.pathname": "/section1/subsection2/subsubsection3/subsubsubsection4/subsubsubsubsubsection5"
	},
	output: {
		"schema": schema_id,
		"data": {
			"article_id": "SB11663273350780754005304582325402391333104",
			"article_source": "",
			"article_published_time": "2016-09-21T13:49:00.000Z",
			"content_type": "",
			"section": "Business",
			"subsection": "section1",
			"subsubsection": "subsection2",
			"subsubsubsection": "",
			"subsubsubsubsection": "",
			"article_paid_content_type": "paid"
		}
	}
}