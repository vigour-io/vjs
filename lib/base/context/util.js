'use strict'
/**
 * @function clearContext
 * Clears context of a base
 * @memberOf Base#
 * @type {base}
 */
exports.clearContext = function () {
  if (this._context) {
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
 * @function clearContextChain
 * Clears all contexts and their contexts
 * @memberOf Base#
 * @type {base}
 */
exports.clearContextChain = function () {
  var context = this._context
  var temp
  while (context) {
    temp = context._context
    context.clearContext()
    context = temp
  }
  return this
}

/**
 * @function setContextChain
 * Set a chain of contexts (contexts on contexts)
 * @memberOf Base#
 * @param {array} chain - Context chain to set
 * @type {base}
 * @todo find a more elegant solution for resolving the parent
 */
exports.setContextChain = function (chain) {
  var bind = chain[0].bind || this
  var iterator = bind
  for (var i = 0, length = chain.length;i < length;i++) {
    iterator._context = chain[i].context
    iterator._contextLevel = chain[i].level
    iterator = iterator._context
  }
  if (iterator) {
    iterator.clearContextUp()
  }
  // needs a better solution
  var parent = bind.parent
  while (parent) {
    parent = parent.parent
  }
  return bind
}

/**
 * @function storeContextChain
 * store a chain of contexts in a chain-array
 * @memberOf Base#
 * @type {array}
 */
exports.storeContextChain = function () {
  var context = this._context
  var chain = [
    {
      context: context,
      level: this._contextLevel,
      bind: this
    }
  ]
  var contextUp = context
  var contextUpCache
  while (contextUp) {
    contextUpCache = contextUp._context
    if (contextUpCache) {
      chain.push({
        context: contextUpCache,
        level: contextUp._contextLevel
      })
    }
    contextUp = contextUpCache
  }
  return chain
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
    !this['_' + key] &&
    (key[0] !== '_' || this.get(['_properties', key, 'override']) === key)
  ) {
    return value
  }
}
