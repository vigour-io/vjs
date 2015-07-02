"use strict";
/**
 * @function $each
 * @memberOf Base#
 * @param  {Function} fn
 * @return {*}
 */
// var find = require('lodash/collection/find')

module.exports = function $each( fn, excludes ) {
  for( var key$ in this ) {
    var type = key$[0]
    if( type !== '_' && type !== '$'
      && ( !excludes 
        || ( typeof excludes === 'function' 
          ? excludes( key$, this ) 
          : key$ !== excludes 
          )
        ) 
    ) {
      var ret = fn( this[key$], key$, this )
      if( ret ) {
        return ret
      }
    }
  } 
  return this
}
