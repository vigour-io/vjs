'use strict'
var Base = require('../base')
var wrapfilter = require('../util/wrapfilter')
var isArrayLike = require('../util/is/arraylike')

exports.define = {
  /**
   * Convert a `Base` object into a plain JSON object
   * @memberOf Base#
   * @param {function} filter function
   * @return {object} Caller converted to standard JSON
   */
  plain (filter, parseValue) {
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
      obj[key] = property.plain ? property.plain(filter, parseValue) : property
    }, wrapfilter(filter))
    return isArrayLike(obj)
  }
}
