var domainsConfig = require('../../config/<%- domainsConfig %>');
var config = require('../lib/config')(domainsConfig);
var cookie = require('../lib/cookie');
var globalDomain = '<%- globalDomain %>';

function getSnowplowDuid(cookieName) {
    var found = cookie.getWithSuffix(cookieName, '\\.[a-f0-9]+');
    if (found) {
        return found.split('.')[0];
    }
    else {
        return false;
    }
}

function receiveMessage(event)
{
    
    // Do we trust the sender of this message?
    var originBase = event.origin.match('^(.*:)//([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$');
    if (event.data.toString().indexOf('getcookie:') != 0 || !originBase[2] || !config.findDomain(originBase[2])) {
        return;
    }
    var id = event.data.toString().split(':')[1];
    var domain = config.findDomain(document.location.hostname);
    var ckie;
    if (!domain.isSnowplowCookie) {
        // This is not a snowplow cookie
        ckie = cookie.get(domain.cookieName);
    }
    else {
        ckie = getSnowplowDuid(domain.cookieName+'id');
    }
    var msg = {
        id: id,
        aka: ckie,
        domain: domain.domain,
        dnt: domain.dnt
    }
    if (domain.isOptOut) {
        msg['isOptOut'] = true;
        msg['optOut'] = cookie.get(domain.optOutDomain.optOutCookieName) == domain.optOutDomain.optOutCookieValue;
    }
    event.source.postMessage('cookie:'+JSON.stringify(msg),event.origin);
}

window.addEventListener("message", receiveMessage, false);