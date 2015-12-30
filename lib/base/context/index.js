'use strict'
// var Base = require('../')
var define = Object.defineProperty

/**
 * @function createContextGetter
 * @memberOf Base#
 * @param  {string} key - Key to create the context getter for
 */
exports.createContextGetter = function (key) {
  var value = this.contextCandidate(key)
  if (!value) {
    key = '_' + key
    value = this[key]
    if (
      value &&
      this.hasOwnProperty(key) &&
      !value.hasOwnProperty('_Constructor') &&
      value._Constructor
    ) {
      for (let val_key in value) {
        value.createContextGetter(val_key)
      }
    }
  } else if (value) {
    let privateKey = '_' + key
    this[privateKey] = value
    for (let val_key in value) {
      value.createContextGetter(val_key)
    }
    define(this, key, {
      get () {
        var value = this[privateKey]
        // console.log('get it!', privateKey)
        if (value) {
          if (!this.hasOwnProperty(privateKey)) {
            value._context = this
          } else if (this._context) {
            value._context = this._context
          } else {
            value.clearContext()
          }
        }
        return value
      },
      set (val) {
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
exports.resolveContext = function (val, event, context) {
  context = context || this._context
  if (context._context) {
    context = context.resolveContext(void 0, event, context._context, true)
  }
  var iterator = this
  var path = [] // again same thing reuse path here not allways make
  var prevContext

  // var proto = Object.getPrototypeOf(context)
  //
  while (iterator && iterator !== context && iterator.key && !(iterator instanceof context._Constructor)) {
    var key = iterator.key
    path.unshift(key)
    iterator = iterator._parent
  }

  var pathLength = path.length
  var pathLengthCompare = pathLength - 1

  for (let i = 0; i < pathLength; i++) {
    if (context) {
      prevContext = context
      context = context.setKeyInternal( // maybe event faster?
        path[i],
        i === pathLengthCompare ? val : {},
        context[path[i]],
        event,
        true
      )

      if (!context) {
        context = prevContext[path[i]]
      }
    }
  }
  // make this fan out to multiple contexts
  // this.clearContextUpSpesh()
  // this.clearContext()
  // this.clearContextUp() // fucker bitch //prob need to restore here :/
  // debugger
  return context
}
