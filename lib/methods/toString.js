"use strict";

exports.$inject = require('./convert')

/**
 * @function toString
 * @memberOf Base#
 * @return {string} String of the object, including stringified functions
 */
exports.$define = {
  toString: function() {
    return JSON.stringify( this.$convert({
      fnToString: true,
      exclude:function( key ) {
        return key[0] === '$'
      }
    }), false, 2 )
  }
}