'use strict'
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
 *) //it logs { $key: 'a', $val: 123 }
 */

// $val moet als je plain doet ipv het object gette, $val getten
// en niet een object maken met $val
// als je convert x & y zonder doller sing val nu
exports.define = {
  convert: function ( options ) {
    var exclude
    var fnToString
    var plain
    var string

    if ( options ) {
      fnToString = options.fnToString
      // !unify exclude!
      exclude = options.exclude
      plain = options.plain || options.raw
      string = options.string
      options.string = null
    }

    var keyValue
    var obj = {}
    var val = this._$input

    for ( var key$ in this) {
      // everything needs to get unified in terms of order etc
      // exclude maybe adden als helper functie
      if ( key$[0] !== '_' && key$[0] !== '$' && ( !exclude || !exclude(key$, this))) {
        keyValue = this[key$]
        if ( keyValue ) {
          obj[key$] = keyValue.convert ? keyValue.convert(options) : keyValue
        }
      }
    }

    if ( val !== void 0) {
      if ( fnToString && typeof val === 'function') {
        obj.$val = String(val)
      } else {
        if ( val instanceof Base) {
          val = plain
            ? '$reference [' + val.$path + ']'
            : { $reference: val.$path }
        }
        if (plain) {
          obj = val
        } else {
          obj.$val = val
        }
      }
    }
    console.error(string)
    return string ? JSON.stringify(obj, false, 2) : obj
  }
}
