'use strict'
/**
 * @property useVal
 * @memberOf Base#
 * @param {*} val
 * Overwrites default set handler and uses val for the property your defining
 * setting to true returns the current instance of Base
 */
exports.useVal = '_useVal'

/**
 * @property noContext
 * @memberOf Base#
 * @param {*} boolean
 * Never create contexts getters for this property
 */
exports.noContext = true

/**
 * @property ignoreInput
 * @memberOf Base#
 * @param {*} boolean
 * Exclude input from parsevalue
 */
exports.ignoreInput = '_ignoreInput'

/**
 * @property output
 * @memberOf Base#
 * @param {*} val
 * Overwrites input when getting .val
 */
exports.output = true

/**
 * @property Constructor
 * @memberOf Base#
 * Overwrites Constructor
 * @param {*} val
 */
exports.Constructor = true

/**
 * @property key
 * @memberOf Base#
 * @param {String} val - Sets key
 */
exports.key = true

/**
 * @property bind
 * @memberOf Base#
 * @param {*} val - bind this value on emitter, and val getters
 */
exports.bind = true

/**
 * @property Constructor
 * @memberOf Base#
 * Overwrites ChildConstructor
 * @param {*} val
 * if val is string tries to get this[val]
 */
exports.ChildConstructor = function (val) {
  var type = typeof val
  if (type === 'string') {
    val = this[val]
  } else if (val && type !== 'function') {
    val = val.Constructor
  }
  this.define({ ChildConstructor: val })
}

/**
 * @property method
 * @memberOf Base#
 * @param {object} val
 *   loop trough val and call methods on base for each key
 *   arrays are parsed for multiple arguments
 *   if you want to pass an array as an argument use [ [ ... ] ]
 * @todo rename this to something better e.g. method
*/
exports.method = function (val) {
  for (let key in val) {
    if (val instanceof Array) {
      this[key].apply(this, val[key])
    } else {
      this[key](val[key])
    }
  }
}

/**
 * @property define
 * @memberOf Base#
 * @param {object} val
 * @todo add util.isArray (faster then instanceof)
 * convenience wrapper for define
*/
exports.define = function (val) {
  if (val instanceof Array) {
    this.define.apply(this, val)
  } else {
    this.define(val)
  }
}

/**
 * @property inject
 * @memberOf Base#
 * @param {object} val
 * convenience wrapper for inject
*/
exports.inject = function (val, event) {
  if (val instanceof Array) {
    if (event) {
      val = val.concat([event])
    }
    this.inject.apply(this, val)
  } else {
    this.inject(val, event)
  }
}

/**
 * @property overwrite
 * @memberOf Base#
 * @param {boolean} val - overwrite current keys and _input of base
 */
exports.overwrite = function (val, event) {
  this.clear(event)
}

/**
 * @property overwrite
 * @memberOf Base#
 * @param {boolean} val - overwrite current keys and _input of base
 */
exports.constructor = function (val, event) {
  this._Constructor = val
  val.prototype = this
}
