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
 * @property useConstructor
 * @memberOf Base#
 * @param {*} val
 * Overwrites default constructor uses constructor passed to val
 */
exports.useConstructor = true

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
 * @param {String} val Sets key
 * @return {String} returns property key
 */
exports.key = true

/**
 * @property Constructor
 * @memberOf Base#
 * Overwrites ChildConstructor
 * @param {*} val
 * if val is string tries to get this[val]
 */
exports.ChildConstructor = function (val) {
  var typeOf = typeof val
  if (typeOf === 'string') {
    val = this[val]
  }
  this.define({ ChildConstructor: val })
}

/**
 * @property $
 * @memberOf Base#
 * @param {object} val
 *   loop trough val and call methods on base for each key
 *   arrays are parsed for multiple arguments
 *   if you want to pass an array as an argument use [ [ ... ] ]
 * @todo rename this to something better e.g. method
*/
exports.$ = function (val) {
  for (var key in val) {
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
exports.inject = function (val) {
  if (val instanceof Array) {
    this.inject.apply(this, val)
  } else {
    this.inject(val)
  }
}
