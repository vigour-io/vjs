"use strict";

/**
 * @function each
 * @memberOf Base#
 * @param  {Function} fn
 * @return {*}
 */
exports.$define = {
  each: function( fn, excludes, attach ) {
    var length = this.length
    if(length !== void 0) {
      for( var i = 0 ; i < length ; i++ ) {
        if( !excludes ||
            ( typeof excludes === 'function'
              ? !excludes( this[i], i, this, attach )
              : key$ !== excludes
            )
          ) {
          var ret = fn( this[i], i, this, attach )
          if( ret ) {
            return ret
          }
        }
      }
    } else {
      for( var key$ in this ) {
        var type = key$[0]
        //fix that if you add a function as excludes you can run trough _ and $ perhaps?
        if( type !== '_' &&
            type !== '$' &&
            this[key$] !== null &&
            ( !excludes ||
              ( typeof excludes === 'function'
                ? !excludes( this[key$], key$, this, attach )
                : key$ !== excludes
              )
            )
        ) {
          var ret = fn( this[key$], key$, this, attach )
          if( ret ) {
            return ret
          }
        }
      }
    }
    return this
  }
}
