"use strict";

exports.$inject = require('./convert')

/**
 * @function toString
 * @memberOf Base#
 * @param  {fn} exclude. Optional function to exclude properties. It defaults
 * to ignore keys that starts with '$' (e.g.: $key)
 * @return {string} String of the object, including stringified functions
 */
exports.$define = {
  toString: function(exclude, notRaw) {
    return JSON.stringify( this.convert({
      fnToString: true,
      exclude: exclude || function( key ) {
        return key[0] === '$'
      },
      raw: !notRaw
    }), false, 2 )
  }
}
