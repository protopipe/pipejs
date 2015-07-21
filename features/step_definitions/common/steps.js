module.exports = function() {
    this.World = require('../../support/world.js');

    this.Given(/^a legacy website running on Port (\d+) always responding with:$/, function (arg1, string, callback) {
      // Write code here that turns the phrase above into concrete actions
      callback.pending();
    });

    this.Given(/^the pipe is configured to proxy 'http:\/\/localhost:(\d+)'$/, function (arg1, callback) {
      // Write code here that turns the phrase above into concrete actions
      callback.pending();
    });

    this.Given(/^the pipe is running$/, function (callback) {
      // Write code here that turns the phrase above into concrete actions
      callback.pending();
    });

    this.When(/^I am on '\/'$/, function (callback) {
      // Write code here that turns the phrase above into concrete actions
      callback.pending();
    });

    this.Then(/^I should see 'Hello World'$/, function (callback) {
      // Write code here that turns the phrase above into concrete actions
      callback.pending();
    });

}
