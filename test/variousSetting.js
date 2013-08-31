/**
 * Various setting test
 */
var Fixture = require('./fixture');

describe('Various setting test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#verifyCredentials', function() {
      it('param1', function(done) {
        /**
         * Verify credentials
         * @function
         * @param {Croudia~userCallback} callback User callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.verifyCredentials = function(callback) {};
      });
    });

    describe.skip('#updateProfileImage', function() {
      it('param1', function(done) {
        /**
         * Update profile image
         * @function
         * @param {String} image_path Image(PNG, JPG, GIF) file path
         * @param {Croudia~userCallback} callback User callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.updateProfileImage = function(image_path, callback) {};
      });
    });

    describe.skip('#updateProfile', function() {
      it('param1', function(done) {
        /**
         * Update profile
         * @function
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>name</li><li>url</li><li>location</li><li>description</li></ul>
         * @param {Croudia~userCallback} callback User callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.updateProfile = function(params, callback) {};
      });
    });
  });
});
