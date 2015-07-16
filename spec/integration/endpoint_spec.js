var request = require('request'),
    hippie = require('hippie'),
    server = require('../../lib/app.js'),
    http = require('http');

describe("Service is reachable", function() {

    var subject = hippie(server);


    it("Service returns positive helth object on /health", function(done) {
        subject.get('/health').end(function(err, res, body) {
            expect(res.statusCode).toBe(200);
            expect(body).toBe('{"status": "success"}');
            done();
        });
    });

    it("returns the google page if it is set as proxied Url", function(done) {
        server.setProxyUrl("https://google.de");
        subject.get('/').end(function(err, res, body) {
            expect(body).toContain("Google");
            server.setProxyUrl(undefined);
            done();
        });
    });

    describe("There is a proxied server running with replacement tags", function() {
        var mockedServer = http.createServer(function (req, resp) {
            resp.write("<!--@@begin-header@@-->");
            resp.write("should be removed");
            resp.end("<!--@@end-header@@—>");

        });
        mockedServer.listen(3001);

        beforeEach(function() {
            server.setProxyUrl("http://localhost:3001");
        });

        afterEach(function() {
            server.setProxyUrl(undefined);
        });

        it("replaces the replacement tag with an empty string", function(done) {
            subject.get('/').end(function(err, res, body) {
                expect(body).not.toContain("should be removed");
                done();
            });
        });
    });
});
