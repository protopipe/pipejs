var request = require('request'),
    hippie = require('hippie'),
    server = require('../../lib/app.js'),
    http = require('http'),
    enableDestroy = require('server-destroy');;

var mockServer = function(cb, dontAutoclose) {
    var oneTimeServer = http.createServer(function (req, resp) {
        cb(req, resp, oneTimeServer);

        if (!dontAutoclose) {
            oneTimeServer.destroy();
        }
    });

    oneTimeServer.listen(3001);

    enableDestroy(oneTimeServer);
}

describe("Service is reachable", function() {

    var subject = hippie(server);


    it("Service returns positive helth object on /health", function(done) {
        subject.get('/health').end(function(err, res, body) {
            expect(res.statusCode).toBe(200);
            expect(body).toBe('{"status": "success"}');
            done();
        });
    });

    it("returns plain page if it is set as proxied Url", function(done) {
        mockServer(function(req, res) {
            res.end("<head><title>Foo</title></head><body>Bar</body>");
        });

        server.setProxyUrl("http://localhost:3001");
        subject.get('/').end(function(err, res, body) {
            expect(body).toContain("<body>Bar</body>");
            server.setProxyUrl(undefined);
            done();
        });
    });

    describe("There is a proxied server running with replacement tags", function() {

        beforeEach(function() {
            server.setProxyUrl("http://localhost:3001");
        });

        afterEach(function() {
            server.setProxyUrl(undefined);
        });

        it("replaces the replacement tag with an empty string if it's all in one line", function(done) {
            mockServer(function (req, resp) {
                resp.end(
                    "<!--@@begin-header@@-->" +
                    "should be removed" +
                    "<!--@@end-header@@-->" +
                    "should stay"
                );
            });

            subject.get('/').end(function(err, res, body) {
                expect(body).not.toContain("should be removed");
                expect(body).toBe("should stay");
                done();
            });
        });

        it("replaces the replacement tag with an empty string if its in multiple lines", function(done) {
            mockServer(function (req, resp) {
                resp.write("<!--@@begin-header@@-->");
                resp.write("should be removed");
                resp.write("<!--@@end-header@@-->");
                resp.end("should stay");
            });

            subject.get('/').end(function(err, res, body) {
                expect(body).not.toContain("should be removed");
                expect(body).toBe("should stay");
                done();
            });
        });

        it("should create a server instance", function(done) {
            server.listen(3002, done);
        });

        it("even if the proxy needs much time, the template server should respond with the allready received part", function(done) {
            mockServer(function (req, res, server) {
                res.write("Some Text...");
                setTimeout(function() {
                    res.end("Some more Text");
                    server.destroy();
                }, 1000);
            }, true);


            var responseContent = "";
            var request = http.request({host: 'localhost', port:"3002", path: '/' });
            request.setTimeout(200)
            request.on('response', function(res) {
                res.on('data', function(chunk) {
                    if (chunk.toString().indexOf("Some Text...") != -1) {
                        done();
                    }
                });

                res.on('end', function() {
                    expect(true).toBe(false);
                });
            });

            request.end();
        }, 1000);


    });
});
