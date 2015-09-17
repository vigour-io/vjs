"use strict";
var isLikeNumber =require('../util').isLikeNumber
/**
 * @function raw converts the Base object into a normal javascript wObject, removing internal properties.
 *  It also converts nested objects and rebuilds arrays from objects with nothing but integer keys.
 * @memberOf Base#
 * @param  {object} [options]
 * @param  {boolean} options.fnToString
 * @return {object}
 * @example
 * 	var a = new Base({ 'a': 123 })
 * 	console.log(a.raw()) //it logs { 'a': 123 }
 */
exports.$define = {
  raw:function( options ) {
    var exclude
    if (options) {
      exclude = options.exclude
    }
    function raw ( obj ) {
      var newObj = {}
      var val = obj._$input
      if (val !== void 0) {
        newObj = val
      } else {
        var isArrayLike = true
        var asArray = []
        var newVal
        for( var key in obj ) {
          if ( key[0] !== '_' && key !== '$key' && key !== '$val' && (!exclude||!exclude(key, obj)) ) {
            if (!isLikeNumber(key)) {
              isArrayLike = false
            }
            newVal = raw(obj[key])
            newObj[key] = newVal
            if (isArrayLike) {
              asArray[key] = newVal
            }
          }
        }
        if (isArrayLike) {
          newObj = asArray
        }
      }
      return newObj
    }
    return raw(this)
  }
}
