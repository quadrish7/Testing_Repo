var schema_id  = 'iglu:com.newscgp/aka/jsonschema/1-0-0';
module.exports = {
	input: {
		"schema": schema_id,
		"data": {
			"user_id": "",
			"user_provider": undefined,			
			"user_memtype": "nonsubscriber",
			"user_newsletter_id": undefined,
			"user_newsletter_provider": "SalesForce",
			"browser_dmp_id": undefined,
			"browser_dmp_provider": "bluekai",
			"browser_ads_ppid": "",
			"browser_ads_provider": undefined,
			"browser_analytics_id": undefined,
			"browser_analytics_provider": "omniture",
			"browser_ncg_id": "8ea223bc-20c8-400f-8d5a-214911b3b3ea"
		}
	},
	output: {
		"schema": schema_id,
		"data": {
			"user_id": "",
			"user_provider": "",			
			"user_memtype": "nonsubscriber",
			"user_newsletter_id": "",
			"user_newsletter_provider": "SalesForce",
			"browser_dmp_id": "",
			"browser_dmp_provider": "bluekai",
			"browser_ads_ppid": "",
			"browser_ads_provider": "",
			"browser_analytics_id": "",
			"browser_analytics_provider": "omniture",
			"browser_ncg_id": "8ea223bc-20c8-400f-8d5a-214911b3b3ea"
		}
	}
};