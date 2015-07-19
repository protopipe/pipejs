var renderer = require('../../lib/renderer');

describe('Renderer', function() {
    var subject = {};

    describe('with a given main template without dynamic content', function() {
        beforeEach(function() {
            subject = renderer.create('Hello World');
        });

        afterEach(function() {
            subject = {};
        });

        it('renders the template with an empty data object', function() {
            expect(subject.render({})).toBe('Hello World');
        });


        it('renders the template when no data object is given', function() {
            expect(subject.render()).toBe('Hello World');
        });

    });

    describe('It renders a simple template with on dynamic content field', function() {
        beforeEach(function() {
            subject = renderer.create('Hello {{user.name}}');
        });

        afterEach(function() {
            subject = {};
        });

        it('Renders "Hello Bob" for correctly passed data Object', function() {
            data = {
                'user': { 'name': "Bob" }
            };
            expect(subject.render(data)).toBe('Hello Bob');
        });

        it('just renders the template an empty string if data is incomplete', function() {
            data = {};
            expect(subject.render(data)).toBe('Hello ');
        });
    });

    describe('it renders a template with an Helper without arguments', function() {
         beforeEach(function() {
            subject = renderer.create('{{helloWorld}}');
        });

        afterEach(function() {
            subject = {};
        });


        it('calls the registered Helper', function() {
            subject.registerHelper('helloWorld', function() {
                return "Hello World!";
            });
            expect(subject.render()).toBe('Hello World!');
            subject.unregisterHelper('helloWorld');
        });

        it('if the Helper is not defined', function() {
            expect(subject.render()).toBe('');
        });

    });

    describe('it renders a template with an Helper with arguments', function() {
         beforeEach(function() {
            subject = renderer.create('{{hello user.name}}');
        });

        afterEach(function() {
            subject = {};
        });


        it('calls the registered Helper', function() {
            subject.registerHelper('hello', function(data) {
                return "Hello "+data+"!";
            });

            data = {
                user: { name: "Bob" }
            }
            expect(subject.render(data)).toBe('Hello Bob!');
            subject.unregisterHelper('hello');
        });

        it('if the Helper is not defined, it throws an Error', function() {
            expect(subject.render).toThrow('Missing helper: \'hello\'');
        });

    });

    describe('it renders a template with a Partial', function() {
         beforeEach(function() {
            subject = renderer.create('{{> userDetail user}}');
        });

        afterEach(function() {
            subject = {};
        });


        it('calls the registered Helper', function() {
            subject.registerPartial('userDetail', "name: {{name}}, age: {{age}}");

            data = {
                user: { name: "Bob", age: "42" }
            }
            expect(subject.render(data)).toBe('name: Bob, age: 42');
            subject.unregisterPartial('userDetail');
        });

        it('if the Partial is not defined, it throws an Error', function() {
            expect(subject.render).toThrow("The partial userDetail could not be found");
        });

    });

});
