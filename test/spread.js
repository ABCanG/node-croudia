/**
 * Spread test
 */
var Fixture = require('./fixture');

describe('Spread test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#spreadStatus', function() {
      it('param1', function(done) {
        /**
         * Spread status
         * @function
         * @param {Number} id Status id
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
         * @param {Croudia~statusCallback} callback Status callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.spreadStatus = function(id, params, callback) {};
      });
    });
  });
});
