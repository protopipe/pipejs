var server = require('express')(),
    request = require('request'),
    HeaderStream = require('./headerReplacementStream');

var _proxyUrl = undefined;


var setProxyUrl = function(proxyUrl) {
    _proxyUrl = proxyUrl;
}


server.get('/health', function(req, res) {
    res.send('{"status": "success"}');
});

server.get(/^\/(?!health).*$/, function(req, res) {
    if (_proxyUrl != undefined) {
        var headerStream = HeaderStream.create();
        request.get(_proxyUrl)
            .pipe(headerStream)
            .pipe(res);
    } else {
        res.status(500);
        res.send('No Proxy configured');
    }
});


module.exports = {
    listen: function(port, cb) { return server.listen(port, cb) },
    setProxyUrl: setProxyUrl
};
