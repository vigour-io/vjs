"use strict";
var Base = require('../base')

/**
 * @function converts the Base object into a normal javascript wObject,
 * ignoring internal properties. It also converted nested objects which in
 * turn are childConstructor instances.
 * @memberOf Base#
 * @param  {object} [options]
 * @param  {boolean} options.fnToString
 * @return {object}
 * @example
 * 	var a = new Base({ $key: 'a', $val: 123})
 * 	console.log(a.convert()) //it logs { $key: 'a', $val: 123 }
 */
exports.$define = {
  convert:function( options ) {
    var exclude, fnToString, raw;

    if( options ) {
      fnToString = options.fnToString
      //!unify exclude!
      exclude = options.exclude
      raw = options.raw
    }

    var keyValue
    var obj = {}
    var val = this._$input

    for( var key$ in this ) {
      //everything needs to get unified in terms of order etc
      //exclude maybe adden als helper functie
      if ( key$[0] !== '_' && (!exclude||!exclude(key$, this)) ) {
        keyValue = this[key$]
        if( keyValue ) {
          obj[key$] = keyValue.convert ? keyValue.convert(options) : keyValue
        }
      }
    }

    if( val !== void 0 ) {
      if( fnToString && typeof val === 'function' ) {
        obj.$val = String( val )
      } else {
        if( val instanceof Base ) {
          val = raw
            ? '$reference [' + val.$path + ']'
            : { $reference: val.$path }
        }
        if(raw) {
          obj = val
        } else {
          obj.$val = val
        }
      }
    }
    return obj
  }
}
