'use strict'
var Base = require('../base')
var wrapfilter = require('../util/wrapfilter')
var isArrayLike = require('../util/is/arraylike')

function plain (filter, parseValue) {
  var input = this._input
  if (input !== void 0) {
    if (input instanceof Base) {
      return 'reference [' + input.path + ']'
    } else {
      return parseValue
        ? this.val
        : input
    }
  }
  var obj = {}
  this.each(function (property, key) {
    obj[key] = property instanceof Base
      ? plainBase(property, filter, parseValue)
      : plainNonBase(property, filter, parseValue)
  }, wrapfilter(filter))
  return isArrayLike(obj)
}

exports.define = {
  /**
   * Convert a `Base` object into a plain JSON object
   * @memberOf Base#
   * @param {function} filter function
   * @return {object} Caller converted to standard JSON
   */
  plain: plain
}

function plainBase (target, filter, parseValue) {
  return target.plain
    ? target.plain(filter, parseValue)
    : plain.call(target, filter, parseValue)
}

function plainNonBase (target, filter, parseValue) {
  if (target instanceof Object) {
    let result = (target instanceof Array) ? [] : {}
    for (let key in target) {
      let value = target[key]
      if (value instanceof Base) {
        result[key] = plainBase(value, filter, parseValue)
      } else {
        result[key] = plainNonBase(value, filter, parseValue)
      }
    }
    return result
  } else {
    return target
  }
}
