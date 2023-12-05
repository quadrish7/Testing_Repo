var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
module.exports = {
	input: { // added to window.utag_data property
		"data": {
			"article_id": "SB11663273350780754005304582325402391333104",
			"page_content_source": "",
			"article_published": "2016-09-21T13:49:00.000Z",
			"page_section": "",
			"article_access": ""
		},
		"location.pathname": "/section1/subsection2/subsubsection3/subsubsubsection4/subsubsubsubsubsection5"
	},
	output: {
		"schema": schema_id,
		"data": {
			"article_id": "SB11663273350780754005304582325402391333104",
			"article_source": "",
			"article_published_time": "2016-09-21T13:49:00.000Z",
			"content_type": "",
			"section": "section1",
			"subsection": "subsection2",
			"subsubsection": "",
			"subsubsubsection": "",
			"subsubsubsubsection": "",
			"article_paid_content_type": ""
		}
	}
}