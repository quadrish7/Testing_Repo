// Minimal ajax lib
var ajax = function() {
};

ajax.prototype = {

    params: function(obj) {
        var str = [];
        for(var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    },

    setup: function(params) {
        this.xmlhttpsetup = {};
        if (params && params.timeout) {
            this.xmlhttpsetup.timeout = params.timeout; // time in milliseconds
        }
        return this;
    },

    call: function(method, url, params, callback) {
        var xmlhttp=this.xmlhttp || new XMLHttpRequest();
        if (params && params.bust && params.bust === true) {
            params.bust = (new Date()).getTime().toString() + Math.random();
        }
        var src = url + (/\?/.test(url)?'&':'?') + this.params(params);
        xmlhttp.open(method, src);
        if (this.xmlhttpsetup) {
            for (var i in this.xmlhttpsetup) {
                xmlhttp[i] = this.xmlhttpsetup[i];
            }
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                try {
                    xmlhttp.responseObject = JSON.parse(xmlhttp.responseText);
                }
                catch (e) {
                    // silently ignore the error
                }
                callback(xmlhttp);
            }
        }
        xmlhttp.ontimeout = function (e) {
            callback(xmlhttp, e);   
        }
        xmlhttp.crossDomain = true;
        xmlhttp.withCredentials = true;
        xmlhttp.send();
    },

    callWithoutCredential: function(method, url, params, callback) {
        var xmlhttp=this.xmlhttp || new XMLHttpRequest();
        if (params && params.bust && params.bust === true) {
            params.bust = (new Date()).getTime().toString() + Math.random();
        }
        var src = url + (/\?/.test(url)?'&':'?') + this.params(params);
        xmlhttp.open(method, src);
        if (this.xmlhttpsetup) {
            for (var i in this.xmlhttpsetup) {
                xmlhttp[i] = this.xmlhttpsetup[i];
            }
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status === 200) {
                try {
                    xmlhttp.responseObject = JSON.parse(xmlhttp.responseText);
                }
                catch (e) {
                    // silently ignore the error
                }
                callback(xmlhttp);
            }
        }
        xmlhttp.ontimeout = function (e) {
            callback(xmlhttp, e);
        }
        xmlhttp.crossDomain = true;
        xmlhttp.withCredentials = false;
        xmlhttp.send();
    }


}

module.exports = new ajax();