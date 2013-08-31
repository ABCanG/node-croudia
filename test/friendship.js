/**
 * Friendship test
 */
var Fixture = require('./fixture');

describe('friendship test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#createFriendship', function() {
      it('param1', function(done) {
        /**
         * Create friendship
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Croudia~userCallback} callback User callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.createFriendship = function(id, callback) {};
      });
    });

    describe.skip('#destroyFriendship', function() {
      it('param1', function(done) {
        /**
         * Destroy friendship
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Croudia~userCallback} callback User callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.destroyFriendship = function(id, callback) {};
        //Croudia.prototype.deleteFriendship = Croudia.prototype.destroyFriendship;
      });
    });

    describe.skip('#showFriendship', function() {
      it('param1', function(done) {
        /**
         * Show friendship
         * @function
         * @param {?} source source user_id (Number) or screen_name (String)
         * @param {?} target target user_id (Number) or screen_name (String)
         * @param {Croudia~friendshipCallback} callback Friendship callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.showFriendship = function(source, target, callback) {};
      });
    });

    describe.skip('#lookupFriendship', function() {
      it('param1', function(done) {
        /**
         * Lookup friendship
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Croudia~friendshipCallback} callback Friendship callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.lookupFriendship = function(id, callback) {};
      });
    });

    describe.skip('#getFriendsIds', function() {
      it('param1', function(done) {
        /**
         * Get friends ids
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Croudia~idListCallback} callback Id list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getFriendsIds = function(id, callback) {};
      });
    });

    describe.skip('#getFollowersIds', function() {
      it('param1', function(done) {
        /**
         * Get followers ids
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Croudia~idListCallback} callback Id list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getFollowersIds = function(id, callback) {};
      });
    });

    describe.skip('#getFriendsList', function() {
      it('param1', function(done) {
        /**
         * Get friends list
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li></ul>
         * @param {Croudia~userListCallback} callback User list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getFriendsList = function(id, params, callback) {};
      });
    });

    describe.skip('#getFollowersList', function() {
      it('param1', function(done) {
        /**
         * Get followers list
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li></ul>
         * @param {Croudia~userListCallback} callback User list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getFollowersList = function(id, params, callback) {};
      });
    });
  });
});
