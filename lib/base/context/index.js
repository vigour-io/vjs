'use strict'
var Base = require('../')
var define = Object.defineProperty

/**
 * @function createContextGetter
 * @memberOf Base#
 * @param  {string} key - Key to create the context getter for
 */
exports.createContextGetter = function (key) {
  var value = this.contextCandidate(key)
  if (value) {
    var privateKey = '_' + key
    this[privateKey] = value
    for (var val_key in value) {
      value.createContextGetter(val_key)
    }
    define(this, key, {
      get: function () {
        // console.log(privateKey)
        var value = this[privateKey]
        if (value instanceof Base) {
          if (!this.hasOwnProperty(privateKey)) {
            value._context = this
            value._contextLevel = 1
          } else if (this._context) {
            value._contextLevel = this._contextLevel + 1
            value._context = this._context
          } else {
            value.clearContext()
          }
        }
        return value
      },
      set: function (val) {
        this[privateKey] = val
      },
      configurable: true
    })
  }
}

/**
 * @function resolveContext
 * resolves context sets
 * @memberOf Base#
 * @param {*} val set value to be resolved
 * @param {event} event current event
 * @param {base} context resolve this context
 * @param {boolean} alwaysreturn when set to true always returns resolved base
 * @type {base|undefined}
 */
exports.resolveContext = function (val, event, context, alwaysreturn) {
  if (event) {
    event.resolving = this
  }

  context = context || this._context

  if (context._context) {
    context = context.resolveContext({}, event, context._context, true)
  }

  var i = this._contextLevel
  var iterator = this
  var path = []
  var prevContext

  while (i) {
    var key = iterator.key
    path.unshift(key)
    iterator = iterator._parent
    i--
  }

  var resolveEventOrigin = event &&
    event.origin === this &&
    event.context === context

  var pathLength = path.length
  var pathLengthCompare = pathLength - 1

  for (i = 0; i < pathLength; i++) {
    if (context) {
      context.clearContext()
      prevContext = context

      // console.log('lets set parent first!')

      context = context.setKeyInternal(
        path[i],
        i === pathLengthCompare ? val : {},
        context[path[i]],
        event,
        true
      )
      if (!context && alwaysreturn) {
        context = prevContext[path[i]]
      }
    }
  }

  if (resolveEventOrigin) {
    event.context = null
    event.origin = context
  }

  return context
}
