"use strict";
/**
 * @function $toString
 * @memberOf Base#
 * @return {string}
 */

module.exports = function() {
  return JSON.stringify(this.$convert({
    fnToString: true
  }), false, 2)
}