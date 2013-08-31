/**
 * User test
 */
var Fixture = require('./fixture');

describe('User test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#showUser', function() {
      it('param1', function(done) {
        /**
         * Show user
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Croudia~userCallback} callback User callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.showUser = function(id, callback) {};
      });
    });

    describe.skip('#lookupUsers', function() {
      it('param1', function(done) {
        /**
         * Lookup users
         * @function
         * @param {Array} id user_id (Number) or screen_name (String)
         * @param {Croudia~userListCallback} callback User list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.lookupUsers = function(id, callback) {};
        //Croudia.prototype.showUsers = Croudia.prototype.lookupUsers;
      });
    });
  });
});
