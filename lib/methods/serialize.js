'use strict'
var Base = require('../base')

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
