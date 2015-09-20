'use strict'
var Base = require('../base')
var flatten = require('../util/flatten')

/**
 * @function converts the Base object into a normal javascript wObject,
 * ignoring internal properties. It also converted nested objects which in
 * turn are childConstructor instances.
 * @memberOf Base#
 * @param  {object} [options]
 * @param  {boolean} options.fnToString
 * @param  {function} options.exclude
 * @param  {boolean} options.plain
 * @param  {boolean} options.flatten
 * @param  {boolean} options.string
 * @return {object|string|array}
 * @example
 */

exports.$define = {
  convert: function (options) {
    var exclude
    var fnToString
    var plain
    var string
    var flattenObj

    if (options) {
      fnToString = options.fnToString
      // !unify exclude!
      exclude = options.exclude
      plain = options.plain
      string = options.string
      options.string = null
      flattenObj = options.flatten
      options.flatten = null
    }

    var keyValue
    var obj = {}
    var val = this._$input

    for (var key$ in this) {
      // everything needs to get unified in terms of order etc
      // exclude maybe adden als helper functie
      if (key$[0] !== '_' && key$[0] !== '$' && (!exclude || !exclude(key$, this))) {
        keyValue = this[key$]
        if (keyValue) {
          obj[key$] = keyValue.convert ? keyValue.convert(options) : keyValue
        }
      }
    }

    if (val !== void 0) {
      if (fnToString && typeof val === 'function') {
        obj.$val = String(val)
      } else {
        if (val instanceof Base) {
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
    if (flattenObj) {
      obj = flatten(obj)
    }
    return string ? JSON.stringify(obj, false, 2) : obj
  }
}
