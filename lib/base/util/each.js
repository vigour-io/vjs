"use strict";
/**
 * @function $each
 * @memberOf Base#
 * @param  {Function}
 * @return {*}
 */
module.exports = function( fn ) {
  for( var key$ in this ) {
    if( key$[0] !== '_' ) {
      //check what the normal forEach does
      var ret = fn.call( this, this[key$], key$ )
      if( ret ) {
        return ret
      }
    }
  }
}