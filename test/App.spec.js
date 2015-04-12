var App = require("../src/js/models/App.es6");

/**
 * We recommend that you wrap all of your tests in `describe` blocks
 * that correspond to the path of the file that you are testing.  This
 * makes it easy to find the file in question when a test fails, and
 * it disambiguates tests that may otherwise look similar.
 */

describe("src/js/", function () {
  describe("models", function() {
    describe("main", function () {
      var sandbox;

      beforeEach(function () {

        /**
         * Before each test is run, create a new Sinon sandbox that
         * can be used for stubbing and spying on our application code.
         */

        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {

        /**
         * If you use `sinon.stub` or `sinon.spy` instead of the sandbox
         * pattern, make sure to restore them here!  If you don't, the
         * functionality of the stubbed/spied-upon functions will remain
         * altered, and you could unintentionally break other tests.
         */

        sandbox.restore();
      });

      it("should always return an object", function () {

        /**
         * We are describing "src/js/models/App", and asserting that it
         * will always return an object
         */

        expect(App()).to.be.an('object');
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
});