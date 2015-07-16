"use strict";

/**
 * @function each
 * @memberOf Base#
 * @param  {Function} fn
 * @return {*}
 */
exports.$define = {
  each: function( fn, excludes ) {
    var length = this.length
    if(length !== void 0) {
      for( var i = 0 ; i < length ; i++ ) {
        if(!excludes || 
            ( typeof excludes === 'function' 
              ? excludes( key$, this ) 
              : key$ !== excludes 
            )
          ) {
          var ret = fn( this[i], i, this )
          if( ret ) {
            return ret
          }
        }
      }
    } else {
      for( var key$ in this ) {
        var type = key$[0]
        //fix that if you add a function as excludes you can run trough _ and $ perhaps?
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
    }
    return this
  }
}

