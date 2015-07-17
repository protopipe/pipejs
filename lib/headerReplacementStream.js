var Transform = require('stream').Transform,
    util = require('util');

function HeaderReplacementStream() {
    var insideReplacementTag = false;
    Transform.call(this);
}

util.inherits(HeaderReplacementStream, Transform);

HeaderReplacementStream.prototype._transform = function(chunk, enc, cb) {
    var line = chunk.toString();

    var beginTag = /<!--@@begin-header@@-->/;
    var endTag = /<!--@@end-header@@-->/;

    if (this.insideReplacementTag) {
        if (line.match(endTag)) {
            //todo push rendered header
            this.insideReplacementTag = false;
            this.push(line.replace(endTag, ""));
        }
    } else {
        if (line.match(beginTag)) {
            if (!line.match(endTag)) {
                this.insideReplacementTag = true;
            } else {
                this.push(line.replace(/<!--@@begin-header.*end-header@@-->/, ''));
            }
        } else {
            this.push(chunk, enc);
        }

    }

    cb();
};


module.exports = {
    create: function() { return new HeaderReplacementStream() }
}
