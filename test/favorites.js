/**
 * Favorites test
 */
var Fixture = require('./fixture');

describe('favorites test', function() {
  var fixture = new Fixture();
  var Croudia = fixture.getCroudia(),
    croudia = fixture.getCroudiaInstance(),
    assert = fixture.getAssert(),
    config = fixture.getConfig(),
    packageInfo = fixture.getPackageInfo();

  describe('Croudia', function() {
    describe.skip('#getFavorites', function() {
      it('param1', function(done) {
        /**
         * Get favorites
         * @function
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>include_entities</li></ul>
         *  Pager<ul><li>since_id</li><li>max_id</li><li>count</li></ul>
         * @param {Croudia~statusListCallback} callback Status list callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.getFavorites = function(params, callback) {};
      });
    });

    describe.skip('#createFavorite', function() {
      it('param1', function(done) {
        /**
         * Create favorite
         * @function
         * @param {Number} id Favorite id
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>include_entities</li></ul>
         * @param {Croudia~statusCallback} callback Status callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.createFavorite = function(id, params, callback) {};
        //Croudia.prototype.favoriteStatus = Croudia.prototype.createFavorite;
      });
    });

    describe.skip('#destroyFavorite', function() {
      it('param1', function(done) {
        /**
         * Destroy favorite
         * @function
         * @param {Number} id Favorite id
         * @param {Object} params Parameters<br/>
         *  Option<ul><li>include_entities</li></ul>
         * @param {Croudia~statusCallback} callback Status callback
         * @returns {Croudia} this instance
         */
        //Croudia.prototype.destroyFavorite = function(id, params, callback) {};
        //Croudia.prototype.deleteFavorite = Croudia.prototype.destroyFavorite;
      });
    });
  });
});
