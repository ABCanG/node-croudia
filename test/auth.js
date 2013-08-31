/**
 * Authentication test
 */
var Fixture = require('./fixture');

describe('Authentication test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#getAuthorizeUrl', function() {
      it('param1', function(done) {
        /**
         * Get authorize url
         * @function
         * @returns {String} Authorize url
         */
        //Croudia.prototype.getAuthorizeUrl = function() {};
      });
    });
  });

  describe('Croudia', function() {
    describe.skip('#login', function() {
      it('param1', function(done) {
        /**
         * Login by authorized url
         * @function
         * @param {String} responseUrl Response url
         * @param {Function} callback Callback  function() {}
         */
        //Croudia.prototype.login = function(responseUrl, callback) {};
      });
    });
  });

  describe('Croudia', function() {
    describe.skip('#refresh', function() {
      it('param1', function(done) {
        /**
         * Refresh access token
         * @function
         * @param {Function} callback Callback  function() {}
         */
        //Croudia.prototype.refresh = function(callback) {};
      });
    });
  });

  describe('Croudia', function() {
    describe.skip('#setTokenChangeListener', function() {
      it('param1', function(done) {
        /**
         * Set token change listener
         * @function
         * @param {Function} callback Callback  function(tokens) {}
         */
        //Croudia.prototype.setTokenChangeListener = function(listener) {};
      });
    });
  });
});
