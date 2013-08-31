
var Croudia = require('../lib/croudia'),
  assert = require('assert'),
  config = require('./config.json'),
  packageInfo = require('../package.json');

/**
 * Fixture class
 * @class
 */
function Fixture() {
  this.croudia = new Croudia(config)
}
module.exports = Fixture;

/**
 * Get croudia module
 * @function
 * @returns {Croudia} Module
 */
Fixture.prototype.getCroudia = function() {
  return Croudia;
};

/**
 * Get croudia instance
 * @function
 * @returns {Croudia} Instance
 */
Fixture.prototype.getCroudiaInstance = function() {
  return this.croudia;
};

/**
 * Get assert module
 * @function
 * @returns {Assert} Assert module
 */
Fixture.prototype.getAssert = function() {
  return assert;
};

/**
 * Get config
 * @function
 * @returns {Object} Config object
 */
Fixture.prototype.getConfig = function() {
  return config;
};

/**
 * Get package info
 * @function
 * @returns {Object} Package info object
 */
Fixture.prototype.getPackageInfo = function() {
  return packageInfo;
};
