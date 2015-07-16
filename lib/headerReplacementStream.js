var Transform = require('stream').Transform,
    util = require('util');

function HeaderReplacementStream() {
    Transform.call(this);
}

util.inherits(HeaderReplacementStream, Transform);

HeaderReplacementStream.prototype._transform = function(chunk, enc, cb) {
    if (chunk != "should be removed") {
        this.push(chunk, enc);
    }
    cb();
};


module.exports = {
    create: function() { return new HeaderReplacementStream() }
}
