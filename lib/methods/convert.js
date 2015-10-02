'use strict'
var Base = require('../base')
var flatten = require('../util/flatten')
var isNumberLike = require('../util').isNumberLike
var isEmpty = require('../util').isEmpty
var isArrayLike = require('../util').isArrayLike

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
    var obj = {}
    var val = this._input
    var fnToString
    var plain
    var flattenObj
    var string
    // jsStandard: incorrect warning
    var exclude
    var convertToArray = true

    if (options) {
      convertToArray = options.array || true
      fnToString = options.fnToString
      exclude = options.exclude
      plain = options.plain
      string = options.string
      flattenObj = options.flatten
      options.string = null
      options.flatten = null
    }

    this.each(function (property, key) {
      obj[key] = property.convert ? property.convert(options) : property
    }, exclude)

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
