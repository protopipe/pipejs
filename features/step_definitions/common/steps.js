var http = require('http'),
    enableDestroy = require('server-destroy');

module.exports = function() {
    this.World = require('../../support/world.js');

    this.Given(/^a legacy website running on Port (\d+) always responding with:$/, function (arg1, string, callback) {
        var oneTimeServer = http.createServer(function (req, resp) {

            resp.end(string);
            oneTimeServer.destroy();
        });

        oneTimeServer.listen(arg1);

        enableDestroy(oneTimeServer);
        callback();
    });

    this.Given(/^the pipe is configured to proxy '(http:\/\/localhost:\d+)'$/, function (arg1, callback) {
      this.app.setProxyUrl(arg1);
      callback();
    });

    this.Given(/^the pipe is running$/, function (callback) {
      this.app.listen(3002, callback);
    });

    this.When(/^I am on '(.*)'$/, function (path, callback) {
      this.currentPage = path;
      callback();
    });

    this.Then(/^I should see '(Hello World)'$/, function (expectedBody, callback) {
        this.request.get('http://localhost:3002'+this.currentPage, function(error, response, body) {
            if (body == expectedBody) {
                callback();
            } else {
                callback.fail(new Error('Expected Body to be:'+expectedBody + ' but ' + body + ' received'));
            }
        });
    });


    this.Given(/^a legacy website running on Port (\d+) returning a chunk$/, function (port, chunk, callback) {
      // Write code here that turns the phrase above into concrete actions
      this.proxiedServerPort = port;
      this.proxiedChunk = chunk;
      callback();
    });

    this.Given(/^then the legacy website hang for (\d+) second$/, function (timeout, callback) {
        this.proxyTimeout = timeout * 1000;
        callback();
    });

    this.Given(/^then the legacy website responds with$/, function (finalChunk, callback) {
        var proxiedChunk = this.proxiedChunk;
        var timeout = this.proxyTimeout;

        var oneTimeServer = http.createServer(function (req, res) {
            res.write(proxiedChunk);
            setTimeout(function() {
                res.end(finalChunk);
                oneTimeServer.destroy();
            }, timeout);
        });

        oneTimeServer.listen(this.proxiedServerPort);

        enableDestroy(oneTimeServer);
        callback();
    });

    this.Then(/^I should see within (\d+) milliseconds:$/, function (delay, expectedChunk, callback) {
        var request = http.request({host: 'localhost', port: 3002, path: '/' });
        var cb = callback;
        var response = "";
        var foundSnippet = false;
        request.on('response', function(res) {
            res.on('data', function(chunk) {
                response += chunk.toString();
            });
        });

        request.end();

        setTimeout(function() {
            if (response.indexOf(expectedChunk) != -1) {
                callback();
            } else {
                callback.fail("Expected '" + expectedChunk + "' to be part of the response after: "+delay+" milliseconds but got only: "+ response);
            }
        }, delay);
    });

}
