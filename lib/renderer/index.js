var Handlebars = require('handlebars');

var Renderer = function(template) {
    var _template = Handlebars.compile(template);

    this.registerHelper = function(key, cb) { Handlebars.registerHelper(key, cb) };
    this.unregisterHelper = function(key) { Handlebars.unregisterHelper(key) };
    this.registerPartial = function(key, partial) { Handlebars.registerPartial(key, partial) };
    this.unregisterPartial = function(key, partial) { Handlebars.unregisterPartial(key, partial) };

    this.render = function (data) {
        return _template(data);
    }

}


module.exports = {
    create: function(template) { return new Renderer(template) }
};
