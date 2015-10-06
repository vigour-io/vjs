'use strict'
var Base = require('../base')
var wrapFilterFn = require('../util/misc').wrapFilterFn

exports.define = {
  /**
   * Convert a `Base` object into a plain JSON object
   * @memberOf Base#
   * @return {object} Caller converted to standard JSON
   */
  plain: function (filter) {
    var obj = {}
    var val = this._input

    this.each(function (property, key) {
      obj[key] = property.plain ? property.plain(filter) : property
    }, wrapFilterFn(filter))

    if (val !== void 0) {
      if (val instanceof Base) {
        val = 'reference [' + val.path + ']'
      }
      obj = val
    }
    return obj
  }
}
