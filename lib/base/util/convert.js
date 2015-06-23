"use strict";
var Base = require('../')

/**
 * @function $convert
 * @memberOf Base#
 * @param  {object} [options]
 * @param  {boolean} options.fnToString
 * @return {object}
 */
module.exports = function(options) {
  
  if(options) {
    var fnToString = options.fnToString
    var exclude = options.exclude
  }

  var key
  var obj = {}
  var val = this._$val

  for (var key$ in this) {
    //everything needs to get unified in terms of order etc
    
    //exclude maybe adden als helper functie

    if (key$[0] !== '_' && (!exclude||!exclude(key$, this))) {
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
