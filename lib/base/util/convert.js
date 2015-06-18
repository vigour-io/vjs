"use strict";
var Base = require('../')

/**
 * @function $convert
 * @memberOf Base#
 * @param  {object}
 * @param  {boolean} options.fnToString
 * @return {object}
 */
module.exports = function(options) {
  var fnToString = options && options.fnToString
  var key
  var obj = {}
  var val = this._$val

  for (var key$ in this) {
    if (key$[0] !== '_') {
      key = this[key$]
      obj[key$] = key.$convert && key.$convert(options) || key
    }
  }
  if (val) {
    if (fnToString && typeof val === 'function') {
      obj.$val = String(val)
    } else {
      if (val instanceof Base) {
        //hier parsen van ref als optie maken ($val)
        obj.$val = {
          $reference: val.$path
        }
      } else {
        obj.$val = val
      }
    }
  }
  return obj
}
