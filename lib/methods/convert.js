'use strict'
var Base = require('../base')
var flatten = require('../util/flatten')
var isNumberLike = require('../util').isNumberLike
var isEmpty = require('../util').isEmpty

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
      obj[key] = property.convert ? property.convert(options) : key
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
      var onlyNumbers = true
      for (var i in obj) {
        if (!isNumberLike(i)) {
          onlyNumbers = false
          break
        }
      }
      if (onlyNumbers) {
        var keys = Object.keys(obj)
        keys.sort()
        var last = -1
        var ordered = true
        for (var j in keys) {
          if (keys[j]-last!==1) {
            ordered = false
            break
          }
          last = keys[j]
        }
        if (!ordered) {
          console.error(keys)
        } else {
          //this is an array
          var oldobj = obj
          obj = []
          for(var i in keys) {
            obj.push(oldobj[keys[i]])
          }
        }
      }
    }

    return string ? JSON.stringify(obj, false, 2) : obj
  }
}
