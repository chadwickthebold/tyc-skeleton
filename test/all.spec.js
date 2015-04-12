var React = require("../bower_components/react/react-with-addons.js");
var App = require("../src/js/models/App.es6");
var AppView = require("../src/js/components/AppView.jsx");
var chai = require("chai");
var expect = chai.expect;

var TestUtils = React.addons.TestUtils,
    // Since we're not using JSX here, we need to wrap the component in a factory
    // manually. See https://gist.github.com/sebmarkbage/ae327f2eda03bf165261
    AppViewFactory = React.createFactory(AppView);

/**
 * We recommend that you wrap all of your tests in `describe` blocks
 * that correspond to the path of the file that you are testing.  This
 * makes it easy to find the file in question when a test fails, and
 * it disambiguates tests that may otherwise look similar.
 */

describe("src/js/", function () {
    describe("Models", function() {
        describe("App", function () {

            beforeEach(function () {

                /**
                * Sinon can't be used until 2.0 is released
                */

                // sandbox = sinon.sandbox.create();
            });

            afterEach(function () {

                /**
                * Sinon can't be used until 2.0 is released
                */

                // sandbox.restore();
            });

            it("should always return an object", function () {

                /**
                * We are describing "src/js/models/App", and asserting that it
                * will always return an object
                */

                expect(new App()).to.be.an('object');
            });

            it("should be able to set properties on the model", function () {

                /**
                * Chai provides a whole host of assertions.  Check the documentation
                * for a full list.  In addition to those, the seed project includes
                * sinon-chai, which adds assertions related to sinon stubs and spies.
                */

                var testMsg = {message: "This is a message"};
                var newApp = new App(testMsg);
                expect(newApp.get('message')).to.equal(testMsg.message);
            });

        });
    });
    describe("Components", function () {

        describe("AppView", function () {
            var testMsg = {message: "This is a message"};

            before('render and locate element', function() {

                
                var newApp = new App(testMsg);

                // Create our component
                var component = AppViewFactory({
                    app: newApp
                });

                // We want to render into the <body> tag
                var renderTarget = document.getElementById('app-sandbox');

                var renderedComponent = React.render(component, renderTarget);

                // Searching for <span> tag within rendered React component
                // Throws an exception if not found
                var testComponent = TestUtils.findRenderedDOMComponentWithTag(
                    renderedComponent,
                    'span'
                );

                this.testElement = testComponent.getDOMNode();

            });

            it('<span> should have the appview class', function() {
                expect(this.testElement.getAttribute('class')).to.equal('appview');
            });

            it('<span> should contain the correct input message', function() {
                console.log(this.testElement);
                expect(this.testElement.innerText).to.equal(testMsg.message);
            });

        });

    });
});