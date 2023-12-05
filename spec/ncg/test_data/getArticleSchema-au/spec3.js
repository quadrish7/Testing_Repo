var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
module.exports = {
	input: { // added to window.utag_data property
		"data": {			
		}
	},
	output: {
		"schema": schema_id,
		"data": {
			"article_id": "",
			"article_source": "",
			"article_published_time": "", 
			"content_type": "",
			"section":  "",
			"subsection": "",
			"subsubsection": "",
			"subsubsubsection": "",
			"subsubsubsubsection": "",
			"article_paid_content_type": ""
		}
	}
}