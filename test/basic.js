/**
 * Basic test
 */
var Fixture = require('./fixture');

describe('Basic test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe('instance', function() {
      it('Module version', function() {
        assert.equal(Croudia.VERSION, packageInfo.version);
      });

      it.skip('Authentication information', function() {
        assert.equal(croudia.options.consumer_key, config.consumer_key);
        assert.equal(croudia.options.consumer_secret, config.consumer_secret);
        assert.equal(croudia.options.access_token, config.access_token);
        assert.equal(croudia.options.refresh_token, config.refresh_token);
      });
    });

    describe.skip('#get', function() {
      it('param1', function(done) {
        /**
         * GET
         * @function
         * @param {String} url Request url
         * @param {Object} params Parameters
         * @param {Function} callback Callback  function(err, json) {}
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.get = function(url, params, callback) {};
      });
    });

    describe.skip('#post', function() {
      it('param1', function(done) {
        /**
         * Post
         * @function
         * @param {String} url Request url
         * @param {Object} content Parameters
         * @param {String} content_type Content type
         * @param {Function} callback Callback  function(err, json) {}
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.post = function(url, content, content_type, callback) {};
      });
    });
  });
});
