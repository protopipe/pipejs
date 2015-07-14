var request = require('request'),
    hippie = require('hippie'),
    server = require('../../lib/app.js');

describe("Service is reachable", function() {

    var subject = hippie(server);


    it("Service returns httpcode 200 on /", function() {
        subject.get('/').expectStatus(200);
    });

});
