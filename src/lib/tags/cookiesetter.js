var scheduler = require("../scheduler")("_ncg_sch_");
var pixel = require("../pixel");
var cookie = require("../cookie");
var uuid = require("uuid");
var ids = require("../ids");


var CookieSetter = function(cookieExpiryTS) {
  this.expiryTS = cookieExpiryTS;
}

CookieSetter.prototype = {
  
  cookieDomain: cookie.findCookieDomain(),
  schedulerId: "ckstr_" + document.location.hostname.replace(/\./g, '_'),
  schedulerTimeout: 4*60*60, // every four hours
  cookieExpiryDuration: 2*365*24*60, // 2 years since creation time
  ncgGId: "_ncg_g_id_",
  ncgDomainId: "_ncg_domain_id_",
  ncgSpIdPattern: "_ncg_sp_id\..{4}",

  hasHttpDomainIdCookie: function () {
    var domainId = new ids.DomainId(cookie.get(this.ncgDomainId));
    return domainId.isValid() && domainId.isHttpCookie();
  },

  hasNewFormatGIdCookie: function() {
    var networkId = new ids.NetworkId(cookie.get(this.ncgGId));
    return networkId.isValid();
  },

  setDomainId: function() {
    if (this.hasHttpDomainIdCookie())
      return;
    
    var domainId = cookie.get(this.ncgDomainId);
    if (domainId) {
      var atoms =  domainId.split(".");
      if (atoms.length == 4 && uuid.validate(atoms[0])) 
        return;
    }

    var spId = cookie.getCookieFromNamePattern(this.ncgSpIdPattern);
    var createTS = (new Date()).getTime();
    var expiryTS = createTS + (this.cookieExpiryDuration * 60000);
    // set flag to JS cookie (value 0)
    var cookieVal = (spId) 
        ? `${spId.split('.')[0]}.0.${createTS}.${expiryTS}`
        : `${uuid.v4()}.0.${createTS}.${expiryTS}`;
    
    cookie.set(
      this.ncgDomainId, cookieVal, 
      this.cookieExpiryDuration, this.cookieDomain
    );
  },

  run: function(forceRun = false) {
    // domain id is not HTTP cookie and/or _ncg_g_id_ is not in new format
    var shouldRun = !(this.hasHttpDomainIdCookie() && this.hasNewFormatGIdCookie());
    // its more than N hours since last run
    // order of boolean expressions is important, if checckOrSchedule is the last expression
    // then it may be shortcircuted so, ckstr_bu_domain schedule wont be set on first invocation
    shouldRun = scheduler.checkOrSchedule(this.schedulerId, this.schedulerTimeout) 
        || shouldRun;
    // force run on obtaining user consent
    shouldRun = shouldRun || forceRun;
    if (shouldRun) {
      this.setDomainId();
      var url = `https://tags.${this.cookieDomain}/cs/sync/i`;
      if (this.expiryTS) {
        pixel.pixel({"expiry_ts": expiry_ts}, url);
      } else {
        pixel.pixel({}, url);
      }
      scheduler.update(this.schedulerId);
    }
  }
};

module.exports = CookieSetter;

