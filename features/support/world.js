var app = require('../../lib/app.js'),
    request = require('request');

var World = function(cb) {
    this.app = app;
    this.currentPage = '/';
    this.request = request;
    this.proxiedServer = undefined;
    this.proxiedChunk = "";
    cb();
}


module.exports = World;
