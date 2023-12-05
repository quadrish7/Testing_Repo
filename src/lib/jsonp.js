exports.jsonp = function(url, callback) {
    var rnd = Math.round(Math.random() * 1000000);
    var time = (new Date()).getTime();
    var cbname = 'dpipe_audi_cb' + time + rnd;
    var scr = document.createElement('script');

    window[cbname] = callback;

    scr.async = true;
    scr.src = url + (/\?/.test(url)?'&':'?') + 'callback=' + cbname + '&' + time;

    scrs = document.getElementsByTagName('script')[0];
    scrs.parentNode.insertBefore(scr, scrs);
};
