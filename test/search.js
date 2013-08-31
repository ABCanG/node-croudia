/**
 * Search test
 */
var Fixture = require('./fixture');

describe('Search test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#searchVoices ', function() {
      it('param1', function(done) {
        /**
         * Search voices
         * @function
         * @param {String} query Search query
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
         *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
         * @param {Croudia~searchMetaDataListAndStatusListCallback} callback Search meta data list and status list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.searchVoices = function(query, params, callback) {};
      });
    });

    describe.skip('#searchUsers', function() {
      it('param1', function(done) {
        /**
         * Search users
         * @function
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li></ul>
         *  Pager<ul><li>page</li><li>count</li></ul>
         * @param {Croudia~userListCallback} callback User list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.searchUsers = function(query, params, callback) {};
      });
    });
  });
});
