var schema_id = "iglu:com.newscgp/aka/jsonschema/1-0-0";
module.exports = {
	input: {
		"schema": schema_id,
		"data": {
			"user_id": null,
			"user_provider": null,			
			"user_memtype": null,
			"user_newsletter_id": null,
			"user_newsletter_provider": null,
			"browser_dmp_id": null,
			"browser_dmp_provider": null,
			"browser_ads_ppid": null,
			"browser_ads_provider": null,
			"browser_analytics_id": null,
			"browser_analytics_provider": null,
			"browser_ncg_id": null
		}
	},
	output: {
		"schema": schema_id,
		"data": {
			"user_id": "",
			"user_provider": "",			
			"user_memtype": "",
			"user_newsletter_id": "",
			"user_newsletter_provider": "",
			"browser_dmp_id": "",
			"browser_dmp_provider": "",
			"browser_ads_ppid": "",
			"browser_ads_provider": "",
			"browser_analytics_id": "",
			"browser_analytics_provider": "",
			"browser_ncg_id": ""
		}
	}
};