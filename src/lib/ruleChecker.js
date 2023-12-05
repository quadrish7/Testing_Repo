var ajax = require('./ajax');
var debug = require('./debug');

var ruleChecker = function(gdprEndpoint) {
    this.gdprEndpoint = gdprEndpoint;
}

ruleChecker.prototype = {

    shouldEnableNcgTracker: function(domainConfig, callback) {
        var self = this;
        var processGdprResponse = function(result){
            debug.log('GDPR response', result);
            if(result.responseObject && result.responseObject.gdpr_user === "true") {
                callback(null, false);
            } else {
                callback(null, true);
            }
        };

        var gdprRequestErrorHandler = function (ret) {
            debug.log('GDPR error:',ret);
            callback(null, false);
        }

        var checkGdpr = function() {

            ajax.setup({
                timeout: 5000
            }).callWithoutCredential('GET', '//'+self.gdprEndpoint, null, function(ret, err) {
                // We're trying to prevent 404 errors on page, so need to
                // parse the error from the response (if any)
                var status = ret.status;
                switch (status) {
                    case 200:
                        processGdprResponse(ret);
                        break;
                    case 404:
                        // not found, try next
                        gdprRequestErrorHandler(ret);
                        break;
                    default:
                        if (err && err.type && err.type == 'timeout') {
                            debug.log('ruleChecker timeout error', err);
                        }
                        else {
                            debug.log('Unknown ruleChecker error', ret.status, ret.statusText, ret.responseText, err);
                        }
                        gdprRequestErrorHandler(ret);
                        break;
                }
            });
        };

        if(domainConfig.gdprCheckEnabled) {
            checkGdpr();
        } else {
            callback(null, true);
        }
    }
};

module.exports = ruleChecker;