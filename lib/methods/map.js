"use strict";

/**
 * @function map
 * @memberOf Base#
 * @param  {Function} fn
 * @return {*}
 */
exports.$define = {
  map: function( fn, excludes ) {
    var arr =[]
    this.each( function() { 
      arr.push( fn.apply( this, arguments ) ) 
    }, excludes )
    return arr
  }
}