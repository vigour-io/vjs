'use strict'
var Base = require('../base')
var flatten = require('../util/flatten')
var isEmpty = require('../util/is/empty')
var isArrayLike = require('../util/is/arraylike')

/**
 * @function converts the Base object into a string or normal object. It can also filter certain keys and velues.
 * @memberOf Base#
 * @param  {object} [options]
 * @param  {boolean} options.fnToString - Converts function into String
 * @param  {boolean} options.plain - Converts the Base Object into a normal Javascript Object, ignoring internal properties. It also converts nested objects which in turn are childConstructor instances.
 * @param  {boolean} options.flatten - Flattens Object into a single depth object
 * @param  {function} options.filter - Filters key from Object
 * @param  {boolean} options.string - Converts Object into string
 * @param  {boolean} options.array - Converts array-like objects into arrays. Default: true
 * @return {object | string}
 * @example
 */

exports.define = {
  convert: function (options) {
    var obj = {}
    var val = this._input
    var fnToString
    var plain
    var flattenObj
    var string
    var filter
    var convertToArray = true

    if (options) {
      convertToArray = options.array || true
      fnToString = options.fnToString
      flattenObj = options.flatten

      filter = options.filter
      plain = options.plain
      string = options.string

      options.string = null
      options.flatten = null
    }

    this.each(function (property, key) {
      obj[key] = property.convert ? property.convert(options) : property
    }, filter)

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

    if (convertToArray && !isEmpty(obj) && typeof obj === 'object') {
      obj = isArrayLike(obj)
    }

    return string ? JSON.stringify(obj, false, 2) : obj
  }
}
