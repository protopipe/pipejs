var subject = require('../../lib/headerReplacementStream.js');


describe("Header Replacement Stream", function() {

    it("is initializeable", function() {
        expect(subject.create).not.toThrow();
    });

    it("is possible to pipe to stdout", function() {
        var stream = subject.create();

        stream.pipe(process.stdout);
        stream.write("Hello");
        stream.end("World");
    });
});
