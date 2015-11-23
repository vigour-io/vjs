'use strict'
var Base = require('../base')
var wrapfilter = require('../util/wrapfilter')
var isArrayLike = require('../util/is/arraylike')

var _ = require('lodash')

const CIRCULAR = '[Circular]'

function plain (filter, parseValue, circularGuard) {
  if (!circularGuard) {
    circularGuard = [this]
  }
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
  var _this = this
  this.each(function (property, key) {
    if (_.includes(circularGuard, property)) {
      obj[key] = CIRCULAR
    } else {
      circularGuard.push(property)
      obj[key] = property instanceof Base
        ? plainBase(property, filter, parseValue, circularGuard)
        : plainNonBase(property, filter, parseValue, circularGuard)
    }

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

function plainBase (target, filter, parseValue, circularGuard) {
  return target.plain
    ? target.plain(filter, parseValue, circularGuard)
    : plain.call(target, filter, parseValue, circularGuard)
}

function plainNonBase (target, filter, parseValue, circularGuard) {
  if (target instanceof Object) {
    let result = (target instanceof Array) ? [] : {}
    for (let key in target) {
      let value = target[key]
      if (_.includes(circularGuard, value)) {
        result[key] = CIRCULAR
      } else {
        circularGuard.push(value)
        if (value instanceof Base) {
          result[key] = plainBase(value, filter, parseValue, circularGuard)
        } else {
          result[key] = plainNonBase(value, filter, parseValue, circularGuard)
        }
      }
    }
    return result
  } else {
    return target
  }
}
