"use strict";
/**
 * @function $toString
 * @memberOf Base#
 * @return {string} String of the object, including stringified functions
 */
module.exports = function() {
  return JSON.stringify(this.$convert({
    fnToString: true
  }), false, 2)
}