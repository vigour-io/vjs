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
  plain: function (filter) {
    var obj = {}
    var val = this._input

    this.each(function (property, key) {
      obj[key] = property.plain ? property.plain(filter) : property
    }, wrapfilter(filter))

    if (val !== void 0) {
      if (val instanceof Base) {
        val = 'reference [' + val.path + ']'
      }
      obj = val
    }
    return isArrayLike(obj)
  }
}
