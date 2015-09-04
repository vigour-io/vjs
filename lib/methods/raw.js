"use strict";
var Base = require('../base')

/**
 * @function raw converts the Base object into a normal javascript wObject, removing internal properties.
 *  It also converts nested objects.
 * @memberOf Base#
 * @param  {object} [options]
 * @param  {boolean} options.fnToString
 * @return {object}
 * @example
 * 	var a = new Base({ 'a', 123 })
 * 	console.log(a.convert()) //it logs { 'a': 123 }
 */
exports.$define = {
  raw:function( options ) {
    var exclude, fnToString;

    if( options ) {
      fnToString = options.fnToString
      //!unify exclude!
      exclude = options.exclude
    }

    var keyValue
    var obj = {}
    var val = this._$val

    for( var key$ in this ) {
      if ( key$ === '$val') {

      } else if ( key$[0] !== '_' && key$ !== '$key' && (!exclude||!exclude(key$, this)) ) {
        keyValue = this[key$]
        obj[key$] = keyValue.raw && keyValue.raw(options) || keyValue.$val
      }
    }

    if( val !== void 0 ) {
      obj = val
    }

    return obj
  }
}