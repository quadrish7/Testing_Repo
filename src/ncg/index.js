/*
 * Requires
 */
var ncg = require('../lib/ncg');
/*
 * Global constants
 */
var env = '<%- env %>';
var country = '<%- country %>';
var collector = `<%- collector %>`;
var cookieSyncPath = '<%- cookieSyncPath %>';
var domainsConfig = require('../../config/<%- domainsConfig %>');
var tagsConfig = require('../../config/<%- tagsConfig %>');
var schedulerName = '_ncg_sch_';
var cookieSyncScheduleTime = <%- cookieSyncScheduleTime %>; // In seconds
var pageViewThrottleTime =  <%- pageViewThrottleTime %>; // In seconds
var deviceIdSyncTime = <%- deviceIdSyncTime %>; // in seconds
var globalDomain = '<%- globalDomain %>';
var countrySchemas = require('../lib/countries/<%- country %>/schemas');
var countryTags = require('../lib/countries/<%- country %>/tags');
var countryUtils = require('../lib/countries/<%- country %>/utils');
var gdprEndpoint = '<%- gdprEndpoint %>';
var countryConfig = {
    schemas: countrySchemas,
    tags: countryTags,
    utils: countryUtils
};

var siteId = "newsconnect-global";
try {
    if(window.dataLayer['app_id']== "FBIA") 
        siteId =  "nypost-fbia";    
} catch (error) {
    siteId = "newsconnect-global";
}

ncg = new ncg();
ncg.init({
    env: env,
    country: country,
    collector: collector,
    cookieSyncPath: cookieSyncPath,
    siteId: siteId,
    schedulerName: schedulerName,
    cookieSyncScheduleTime: cookieSyncScheduleTime,
    pageViewThrottleTime: pageViewThrottleTime,
    deviceIdSyncTime: deviceIdSyncTime,
    globalDomain: globalDomain,
    domainsConfig: domainsConfig,
    tagsConfig: tagsConfig,
    countryConfig: countryConfig,
    gdprEndpoint: gdprEndpoint,
    
});