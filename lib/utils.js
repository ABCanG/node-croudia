
/**
 * Utilities
 * @module utils
 */

/**
 * Merge objects into the first one
 * @param {Object} defaults Default object
 * @param {...Object} objects Marge objects
 * @returns marged object
 */ 
exports.merge = function(defaults) {
  for(var i = 1, il = arguments.length; i < il; i++){
    for(var opt in arguments[i]){
      defaults[opt] = arguments[i][opt];
    }
  }
  return defaults;
};
