'use strict'
var Base = require('../')
var define = Object.defineProperty

/**
 * @function createContextGetter
 * @memberOf Base#
 * @param  {string} key - Key to create the context getter for
 */
exports.createContextGetter = function (key) {
  // if (!this['_' + key]) {
    let cont = this._context
    let level = this._contextLevel
    let value = this.contextCandidate(key)
    if (!value) {
      // if(key !== '_parent' && )
      key = '_' + key
      value = this[key]
      if (
        value &&
        this.hasOwnProperty(key) &&
        // make it smart here
        !value.hasOwnProperty('_Constructor') &&
        value._Constructor
      ) {
        // console.log('ROUND 2', key)
        for (let val_key in value) {
          // console.log('level 2 lets make!', val_key)
          value.createContextGetter(val_key)
        }
      }
    } else if (value) {
      // console.log('ok ok', key)
      let privateKey = '_' + key
      this[privateKey] = value
      for (let val_key in value) {
        // console.log('2 -- ok ok', val_key)
        value.createContextGetter(val_key)
      }
      define(this, key, {
        get () {
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
        set (val) {
          this[privateKey] = val
        },
        // enumerable: false,
        configurable: true
      })
    }
    if (!cont) {
      this.clearContext()
    } else if (cont !== this._context) {
      this._context = cont
      this._contextLevel = level
    }
  // }
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
  var i = this._contextLevel
  var iterator = this
  var path = []
  var prevContext
  var level = i

  while (i) {
    var key = iterator.key
    path.unshift(key)
    iterator = iterator._parent
    i--
  }

  var pathLength = path.length
  var pathLengthCompare = pathLength - 1

  for (i = 0; i < pathLength; i++) {
    if (context) {
      prevContext = context
      if (pathLengthCompare) {
        // console.log(path[i])
      }
      context = context.setKeyInternal(
        path[i],
        i === pathLengthCompare ? val : {},
        context[path[i]],
        event,
        true // make this from context then we have a spot for it!
      )
      if (!context) {
        context = prevContext[path[i]]
      }
    }
  }
  this.clearContextUp(level)
  return context
}
