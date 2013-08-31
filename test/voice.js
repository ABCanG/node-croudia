/**
 * Voice test
 */
var Fixture = require('./fixture');

describe('Voice test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#updateStatus', function() {
      it('param1', function(done) {
        /**
         * Update status or replay
         * @function
         * @param {String} text Message
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>in_reply_to_status_id</li><li>in_reply_with_quote</li><li>trim_user</li><li>include_entities</li></ul>
         * @param {Croudia~statusCallback} callback Status callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.updateStatus = function(text, params, callback) {};
      });
    });

    describe.skip('#updateWithMediaStatus', function() {
      it('param1', function(done) {
        /**
         * Update status or replay with media
         * @function
         * @param {String} text Message
         * @param {String} media_path Image(PNG, JPG, GIF) file path
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>in_reply_to_status_id</li><li>in_reply_with_quote</li><li>trim_user</li><li>include_entities</li></ul>
         * @param {Croudia~statusCallback} callback Status callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.updateWithMediaStatus = function(text, media_path, params, callback) {};
      });
    });

    describe.skip('#deleteStatus', function() {
      it('param1', function(done) {
        /**
         * Destroy status
         * @function
         * @param {Number} id Status id
         * @param {Croudia~statusCallback} callback Status callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.destroyStatus = function(id, callback) {};
        //Croudia.prototype.deleteStatus = Croudia.prototype.destroyStatus;
      });
    });

    describe.skip('#showStatus', function() {
      it('param1', function(done) {
        /**
         * Show status
         * @function
         * @param {Number} id Status id
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>trim_user</li><li>include_entities</li></ul>
         * @param {Croudia~statusCallback} callback Status callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.showStatus = function(id, params, callback) {};
        //Croudia.prototype.getStatus = Croudia.prototype.showStatus;
      });
    });
  });
});
