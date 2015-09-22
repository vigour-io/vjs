'use strict'
var Base = require('../base')
var flatten = require('../util/flatten')

/**
 * @function converts the Base object into a string or normal object. It can also exclude certain keys and velues.
 * @memberOf Base#
 * @param  {object} [options]
 * @param  {boolean} options.fnToString - Converts function into String
 * @param  {boolean} options.plain - Converts the Base Object into a normal Javascript Object, ignoring internal properties. It also converts nested objects which in turn are childConstructor instances.
 * @param  {boolean} options.flatten - Flattens Object into a single depth object
 * @param  {boolean} options.string - Convertys Object into string
 * @param  {function} options.exclude - Exludes key from Object
 * @return {object | string}
 * @example
 */

exports.define = {
  convert: function (options) {
    var fnToString
    var plain
    var flattenObj
    var string
    var exclude

    if (options) {
      fnToString = options.fnToString
      // !unify exclude!
      exclude = options.exclude
      plain = options.plain
      string = options.string
      flattenObj = options.flatten
      options.string = null
      options.flatten = null
    }

    var obj = {}
    var val = this._input
    var keyValue

    this.each(function (key, property) {
      obj[key] = property.convert ? property.convert(options) : key
      console.log('obj[key]', obj[key])
      console.log('key', key)
      console.log('obj[key].key', obj[key].key)
      console.log('property', property)
    })

    // for (var key$ in this) {
    //   if (key$[0] !== '_' && key$[0] !== '$' && (!exclude || !exclude(key$, this))) {
    //     keyValue = this[key$]
    //     if (keyValue) {
    //       obj[key$] = keyValue.convert ? keyValue.convert(options) : keyValue
    //       console.log(obj[key])
    //     }
    //   }
    // }

    if (val !== void 0) {
      if (fnToString && typeof val === 'function') {
        obj.val = String(val)
      } else {
        if (val instanceof Base) {
          val = plain
            ? 'reference [' + val.path + ']'
            : { reference: val.path }
        }
        if (plain) {
          obj = val
        } else {
          obj.val = val
        }
      }
    }
    if (flattenObj) {
      obj = flatten(obj)
    }
    return string ? JSON.stringify(obj, false, 2) : obj
  }
}
