var domainConfig = function(site, parts) {
    this.domain = site.replace(/^\./,'');
    this.group = parts[0];
    this.cookieName = parts[1];
    this.isSnowplowCookie = !(parts[2] == 1);
    this.envs = (parts[3] && Array.isArray(parts[3])) ? parts[3] : [];
    this.dnt  = parts[4];
    this.excludePixels  = parts[5] || [];
    this.gdprCheckEnabled = parts[6];
}


module.exports = function(config) {

    var domainsConfig = config;

    var findDomain = function(domain) {
        var found = false;
        var dotdomain = '.'+domain;
        for (var site in domainsConfig.sites) {
            var sconf = new domainConfig(site,domainsConfig.sites[site]);
            var envs = [''].concat(sconf.envs);
            envs.forEach(function(env) {
                var testsite = site.replace(/([^.]+)(\.com|\.com\.au|\.co\.uk|\.ie)$/,'$1'+env+'$2');
                if (dotdomain.indexOf(testsite) >= 0 && dotdomain.indexOf(testsite) == (dotdomain.length - testsite.length)) {
                    found = sconf;
                    found.domain = testsite.replace(/^\./,'');
                    return;
                }
            });
            if (found) break;
        };
        if (found) {
            found.domainsInGroup = getGroup(found);
            found.optOutDomain = false;
            if (Array.isArray(found.domainsInGroup)) {
                found.domainsInGroup.forEach(function(d) {
                    if (d.isOptOut) {
                        found.optOutDomain = d;
                        if (d.url.indexOf(domain)==0) {
                            found.isOptOut = true;
                        }
                    }
                });
            }
        }
        return found; 
    }

    var getGroup = function(domain) {
        var group = domain.group;
        return domainsConfig.groups[group];
    }

    return {
        findDomain: findDomain,
        getGroup: getGroup
    }
}