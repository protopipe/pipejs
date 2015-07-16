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

    if (this.insideReplacementTag === true) {
        if (line.match(endTag)) {
            this.insideReplacementTag = false;
            this.push(chunk, enc);
        }
    } else {
        if (line.match(beginTag) && !line.match(endTag)) {
            this.insideReplacementTag = true;
        } else {
            this.push(chunk, enc);
        }

    }

    cb();
};


module.exports = {
    create: function() { return new HeaderReplacementStream() }
}
