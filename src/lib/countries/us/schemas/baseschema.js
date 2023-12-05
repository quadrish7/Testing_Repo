const { AKA_SCHEMA_URL } = require('./sites/utils');
class BaseSchema {
    constructor(){
    }
    
    getAkaSchema(params){
        if(!params){
            return false;
        }
        
        let schema = {
            schema :  AKA_SCHEMA_URL,
            data : {
                user_id: params.user_id || '', // user information
                user_provider: (params.user_id && params.user_provider) ? params.user_provider : '', // Eg: gygia | auth0
                user_memtype: params.user_memtype || 'anonymous', // anonymous | subscriber | registered 
				user_newsletter_id: params.user_newsletter_id || '',// Newsletter subscriptions
				user_newsletter_provider: params.user_newsletter_provider || '', // Eg: SalesForce | MailChimp | CampaignMonitor
				browser_dmp_id: params.browser_dmp_id || '', // unique browser dmp id
				browser_dmp_provider: params.browser_dmp_provider || '', // Eg: krux | bluekai
                // Ads PPID
				// If you send a Publisher Provided Id, or some other unique User Id
				// with your ads requests, please enter it here
				// PLEASE MAKE SURE THAT THIS ID IS TARGETABLE FOR AD SERVING.
                browser_ads_ppid: params.browser_ads_ppid || '', //
				browser_ads_provider: params.browser_ads_provider || '', // Eg: dfp 
                browser_analytics_id: params.browser_analytics_id || '', // unique browser analytics id
				browser_analytics_provider: params.browser_analytics_provider || '', // Eg: omniture | ga
				browser_ncg_id: params.browser_ncg_id || ''                                                                
            }
        }
        return schema;
    }
}

module.exports = BaseSchema;



