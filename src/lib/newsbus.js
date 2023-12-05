module.exports = function(obj, prop, parent) {
    var debug = /(\?|\&)nbd=1($|\&)/.test(location.search);
    // News Bus in page event bus
    // basic pub sub functionality with retained messages and queue based
    // API to overcome async loading issues
    var old = obj[prop] || [];
    // protect against multiple inclusion
    // nb will only have a pop method if it is still actually a list, not an object
    if (old.pop) {
        var nb = obj[prop] = {
            push: function(cmd) {
                var topic = cmd[0], data = cmd[1], once = cmd[2] || false, i;
                var listeners = this.l[topic] = this.l[topic] || [];
                var oldMessages = this.o[topic] = this.o[topic] || [];
                if (typeof(data) == 'function') {
                    // adding a listener
                    if (once) {
                        // Remove the functions after it has been called once
                        var f = function() {
                            var args = [].slice.apply(arguments);
                            data.apply(this,args);
                            listeners[listeners.indexOf(f)] = function() {};
                        };
                        listeners.push(f);
                    }
                    else {
                        listeners.push(data);
                    }
                    
                    // deliver any old messages to the new listener
                    for (i = 0; i < oldMessages.length; i++) {
                        // Let exceptions bubble in debug mode
                        if (debug) {
                            data.apply(parent||this,oldMessages[i]);
                        } else {
                            try {
                                data.apply(parent||this,oldMessages[i]);
                            } catch(e) {
                                if (window.console) {
                                    console.log(e.message || e);
                                }
                            }
                        }
                        if (once) break;
                    }
                } else {
                    // publishing a message
                    for (i = 0; i < listeners.length; i++) {
                        // Let exceptions bubble in debug mode
                        if (debug) {
                            listeners[i].apply(parent||this,[data]);
                        } else {
                            try {
                                listeners[i].apply(parent||this,[data]);
                            } catch(e) {
                                if (window.console) {
                                    console.log(e.message || e);
                                }
                            }
                        }
                    }
                    // save message for any listeners added later
                    oldMessages.push(data);
                }
                return this;
            },
            // listeners
            l: {},
            // old messages for topics
            o: {}
        };
        for (var i = 0; i < old.length; i++) {
            nb.push(old[i]);
        }
    }


}