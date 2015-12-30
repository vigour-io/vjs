'use strict'
/**
 * @function clearContext
 * Clears context of a base
 * @memberOf Base#
 * @type {base}
 */
var debug = require('../../util/debug')
exports.clearContext = function () {
  if (this._context) {
    // console.log('clear context!', this.uid, this._path, debug.stack().toString())
    this._contextLevel = null
    this._context = null
  }
  return this
}

/**
 * @function clearContextUp
 * Clears all context over the parent chain
 * @memberOf Base#
 * @param {int} level - Specify maximum amount of levels to clear
 * @type {base}
 */
exports.clearContextUp = function (level) {
  var parent = this
  var i = 0
  while (parent && (!level || i < level)) {
    i++
    parent.clearContext()
    parent = parent._parent
  }
  return this
}

/**
 * @function isContextCandidate
 * check if a key is a candidate for context getters
 * @memberOf Base#
 * @return {*} returns the field value or undefined
 */
exports.contextCandidate = function (key) {
  var value = this[key]
  if (
    value &&
    value.createContextGetter &&
    !value.noContext &&
    !this['_' + key] &&
    (key[0] !== '_' || this.get(['_properties', key, 'override']) === key)
  ) {
    return value
  }
}
