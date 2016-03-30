'use strict'
var Base = require('../base')

/**
 * @function converts the Base object into a string or normal object. It can also filter certain keys and velues.
 * @memberOf Base#
 * @param  {function} filter function
 * @return {object | string}
 * @example
 */
exports.define = {
  serialize: function (filter) {
    var obj = {}
    var val = this._input
    this.each(function (property, key, base) {
      obj[key] = property.serialize ? property.serialize(filter) : property
    }, filter)
    if (val !== void 0) {
      if (val instanceof Base) {
        val = { reference: val.path }
      }
      obj.val = val
    }
    return obj
  }
}
