"use strict";
/**
 * @function $toString
 * @memberOf Base#
 * @return {string} String of the object, including stringified functions
 */
module.exports = function() {
  return JSON.stringify(this.$convert({
    fnToString: true,
    exclude:function(key) {
      return key[0]==='$'
    }
  }), false, 2)
}