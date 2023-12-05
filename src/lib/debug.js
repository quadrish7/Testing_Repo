var debug = function() {
    this.init();
}

debug.prototype = {

    id: "_ncg_debugger_overlay",

    init: function(isdev) {
        if (this.checkIfActive()) {
            this.buildUI();
        }

        this.initNewsBusDebug();

        this.isdev = isdev;
    },

    initNewsBusDebug : function () {
        var nbDebug = /(\?|\&)nbd=1($|\&)/.test(location.search);
        if (nbDebug) {

            function isNbvScriptLoaded() {
                var scripts = document.getElementsByTagName('script');
                for (var i = scripts.length; i--;) {
                    if (scripts[i].src.indexOf("/nbv.js") >= 0) return true;
                }
                return false;
            }

            function loadNbv() {
                var script = document.createElement('script');
                script.src = '//tags.news.com.au/prod/ntag/nbv.js';
                document.getElementsByTagName('head')[0].appendChild(script); //or something of the likes
            }

            // load the event viewer
            if(!isNbvScriptLoaded()){
                loadNbv();
            }
        }
    },

    checkIfActive: function() {
        var qs = /(\?|\&)_ncg_debug_=1($|\&)/.test(location.search);
        var ss = window.sessionStorage && window.sessionStorage._ncg_debug_ && window.sessionStorage._ncg_debug_ == 1;
        if (qs && window.sessionStorage) {
            window.sessionStorage._ncg_debug_ = 1;
        }
        return qs || ss;
    },

    log: function() {
        if (!this.checkIfActive() && !this.isdev) return;
        var args = [];
        Array.prototype.slice.call(arguments).forEach(function(arg) {
            var logString = JSON.stringify(arg,null, 4);
            args.push(logString);
            if(!document.body){
                console.log(logString);
            }
        });
        var line = document.createElement('div');
        line.setAttribute('class', 'ncg-pre')
        line.innerHTML = args.join(' ');
        this.overlay.appendChild(line);
        if (window.console) {
            console.log.apply(window.console, Array.prototype.slice.call(arguments));
        }
    },

    buildUI: function() {
        var css = document.createElement('style');
        var head = document.head || document.getElementsByTagName('head')[0];
        var hstyle = document.createElement('style');        
        var style = '';
        style += ' #' + this.id + '{position:fixed;bottom:0;left:0;right:0;opacity:0.7;z-index:10000000;width:95%;height:100px;background-color:black;color:white;overflow-x:scroll;overflow-y:auto;font-size:12px;font-weight:normal}'
        style += ' #' + this.id + ' .ncg-close {position:absolute;top:0px;right:0px;margin:2px;cursor:pointer}';
        style += ' #' + this.id + ' .ncg-clear {position:absolute;top:0px;right:20px;margin:2px;cursor:pointer}';
        style += ' #' + this.id + ' .ncg-pre {white-space: pre; font-size: 12px !important; background-color: #000 !important; color: #fff !important; border-bottom: 1px solid gray}';
        hstyle.type = 'text/css';
        if (hstyle.styleSheet){
            hstyle.styleSheet.cssText = style;
        } else {
            hstyle.appendChild(document.createTextNode(style));
        }
        head.appendChild(hstyle);

        var overlay = document.createElement('div');
        overlay.id = this.id;
        // overlay.setAttribute('style', 'position:fixed;bottom:0;left:0;right:0;opacity:0.7;z-index:10000000;width:95%;height:100px;background-color:black;color:white;overflow-x:scroll;overflow-y:auto;font-size:12px;font-weight:normal');
        if(document.body){
            document.body.appendChild(overlay);
        }
        this.overlay = overlay;
        // Add close button
        var close = document.createElement('div');
        close.setAttribute('class', 'ncg-close');
        close.innerHTML = '&#9447;';
        this.overlay.appendChild(close);
        close.addEventListener('click', function() {
            try{
                delete(window.sessionStorage._ncg_debug_); 
                window.location = window.location.toString().replace(/(\\?|&|&amp;)_ncg_debug_=1/,'');
            }catch(e){}
        });
        // Add clear scheduler button
        var clearSch = document.createElement('div');
        clearSch.setAttribute('class','ncg-clear');
        clearSch.innerHTML = 'Clear Scheduler';
        this.overlay.appendChild(clearSch);
        clearSch.addEventListener('click', function() {
            try{
                delete(window.localStorage._ncg_sch_); 
            }catch(e){}
        });
    }
}

module.exports = new debug;