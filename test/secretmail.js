/**
 * Secret mail resources
 */
var Fixture = require('./fixture');

describe('Secret mail test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#getSecretMails', function() {
      it('param1', function(done) {
        /**
         * Get secret mails
         * @function
         * @param {Object} params Parameters<br/>
         *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
         * @param {Croudia~secretmailListCallback} callback Secretmail list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getSecretMails = function(params, callback) {};
      });
    });

    describe.skip('#getSecretMailsSent', function() {
      it('param1', function(done) {
        /**
         * Get secret mails send
         * @function
         * @param {Object} params Parameters<br/>
         *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
         * @param {Croudia~secretmailListCallback} callback Secretmail list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getSecretMailsSent = function(params, callback) {};
        //Croudia.prototype.getSentSecretMails = Croudia.prototype.getSecretMailsSent;
      });
    });

    describe.skip('#newSecretMail', function() {
      it('param1', function(done) {
        /**
         * New Secret mail
         * @function
         * @param {?} id user_id (Number) or screen_name (String)
         * @param {String} text Message
         * @param {Croudia~secretmailCallback} callback Secretmail callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.newSecretMail = function(id, text, callback) {};
        //Croudia.prototype.updateSecretMail = Croudia.prototype.newSecretMail;
        //Croudia.prototype.sendSecretMail = Croudia.prototype.newSecretMail;
      });
    });

    describe.skip('#destroySecretMail', function() {
      it('param1', function(done) {
        /**
         * Destroy secret mail
         * @function
         * @param {Number} id Secret mail id
         * @param {Croudia~secretmailCallback} callback Secretmail callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.destroySecretMail = function(id, callback) {};
        //Croudia.prototype.deleteSecretMail = Croudia.prototype.destroySecretMail;
      });
    });

    describe.skip('#showSecretMail', function() {
      it('param1', function(done) {
        /**
         * Show secret mail
         * @function
         * @param {Number} id Secret mail id
         * @param {Croudia~secretmailCallback} callback Secretmail callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.showSecretMail = function(id, callback) {};
        //Croudia.prototype.getSecretMail = Croudia.prototype.showSecretMail;
      });
    });
  });
});
