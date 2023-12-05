// Fire a newsdiscover pixel request with the given data
// The data is an object of parameterName: value
// The net_uid parameter will be filled in automatically
// At least one parameter must be provided or no call will be made
exports.pixel = function(data, pixel, callback, errcallback) {
    if (!pixel) {
        throw new Exception('Expecting a pixel name in second parameter');
    }
    var params = [];
    for (var k in data) {
        if (data[k] !== undefined) {
            params.push(k + '=' + encodeURIComponent(data[k]));
        }
    }
    var img = new Image();
    if (callback) {
        img.onload = callback;
    }
    if (errcallback) {
        img.onerror = errcallback;
    }
    if (params.length) {
        pixel += (pixel.indexOf('?')<0 ? '?': '&')  + (params.join("&"));
    }
    img.src = pixel;
};
