var schema_id  = 'iglu:com.newscgp/article/jsonschema/1-0-0';
module.exports = {
	input: { // add to dataLayer array at index-0 i.e window.dataLayer[0]
		"data": [{
			"post_id": "11116952",
			"publish_date": "2017/07/23",
			"publish_time": "20:19:32",
			"section": "metro",
			"primary_tag": "bill de blasio",
			"byline": ["Shawn Cohen","Larry Celona","Priscilla DeGregory","Michael Gartland","Bruce Golding"]
		}],
		"location.pathname": "/section1/subsection2/subsubsection3/subsubsubsection4/subsubsubsubsubsection5"
	},
	output: {
		"schema": schema_id,
		"data": {
			"article_id": "11116952",
			"article_source": "Shawn Cohen",
			"article_published_time": "2017/07/23 20:19:32",
			"content_type": "",
			"section": "metro",
			"subsection": "bill de blasio",
			"subsubsection": "",
			"subsubsubsection": "",
			"subsubsubsubsection": "",
			"article_paid_content_type": ""
		}
	}
}