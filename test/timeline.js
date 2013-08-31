/**
 * Timeline test
 */
var Fixture = require('./fixture');

describe('Timeline test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#getPublicTimeline', function() {
      it('param1', function(done) {
        /**
         * Get public timeline
         * @function
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
         *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
         * @param {Croudia~statusListCallback} callback Status list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getPublicTimeline = function(params, callback) {};
      });
    });

    describe.skip('#getHomeTimeline', function() {
      it('param1', function(done) {
        /**
         * Get home timeline
         * @function
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
         *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
         * @param {Croudia~statusListCallback} callback Status list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getHomeTimeline = function(params, callback) {};
      });
    });

    describe.skip('#getUserTimeline', function() {
      it('param1', function(done) {
        /**
         * Get user timeline
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {Object} params Parameters<br/>
         *  Require either<ul><li>user_id</li><li>screen_name</li></ul>
         *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
         *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
         * @param {Croudia~statusListCallback} callback Status list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getUserTimeline = function(id, params, callback) {};
      });
    });

    describe.skip('#getMentions', function() {
      it('param1', function(done) {
        /**
         * Get mentions
         * @function
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
         *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
         * @param {Croudia~statusListCallback} callback Status list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getMentions = function(params, callback) {};
      });
    });
  });
});
