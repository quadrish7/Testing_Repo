var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
module.exports = {
	input: { // added to window.utag_data property
		"data": {			
			"net_article_id": "3203942",
			// OR "nlm_recipe_id": "5741",
			// OR "nlm_gallery_id": "Kr0Anqty",			
			"net_article_source": "nca",			
			"net_article_date": "2017-07-24 05:30:39",
			// OR "net_origin_pudate": "TEST_origin_pudate",
			// OR "nlm_gallery_pubdate": "TEST_gallery_pubdate",			
			// OR 'article:published_time' - META tag
			"net_content_type": "video+comments+story",
			"net_sec1": "lifestyle",
			"net_sec2": "motoring",
			"net_sec3": "TEST_section3",
			"net_sec4": "TEST_section4",
			"net_sec5": "TEST_section5",
			"pc_conttyperule": "TEST_pc_conttyperule"
		}
	},
	output: {
		"schema": schema_id,
		"data": {
			"article_id": "3203942",
			"article_source": "nca",
			"article_published_time": "2017-07-24 05:30:39", 
			"content_type": "video+comments+story",
			"section":  "lifestyle",
			"subsection": "motoring",
			"subsubsection": "TEST_section3",
			"subsubsubsection": "TEST_section4",
			"subsubsubsubsection": "TEST_section5",
			"article_paid_content_type": "TEST_pc_conttyperule"
		}
	}
}