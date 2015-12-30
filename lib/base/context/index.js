'use strict'
var Base = require('../')
var define = Object.defineProperty
var debug = require('../../util/debug')
console.line = false
// exports._context = {
//   get: function getcntx () {
//     return this.__context
//   },
//   set: function setcntx (val) {
//     if (!this.__context) {
//       console.warn('yo bitch set context', this._path, debug.stack().toString(), val._path)
//       // debug.context()
//     }
//     this.__context = val
//   }
// }
/**
 * @function createContextGetter
 * @memberOf Base#
 * @param  {string} key - Key to create the context getter for
 */
exports.createContextGetter = function (key) {
  // this has to become way way way better
  if (!this['_' + key]) {
    let cont = this._context
    let level = this._contextLevel
    let value = this.contextCandidate(key)
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
        configurable: true
      })
    }
    if (!cont) {
      this.clearContext()
    } else if (cont !== this._context) {
      this._context = cont
      this._contextLevel = level
    }
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
  var i = this._contextLevel
  var iterator = this
  var path = []
  var prevContext
  var level = i
  var cntx = this._context

  while (i) {
    var key = iterator.key
    path.unshift(key)
    iterator = iterator._parent
    i--
  }

  var pathLength = path.length
  var pathLengthCompare = pathLength - 1

  // console.group()
  console.info('RC', this.path, debug.stack().toString())
  for (i = 0; i < pathLength; i++) {
    if (context) {
      // let lcontext = context._context
      // let llevel = context._contextLevel
      // let llcontext =
      // console.log(' rc segment:', path[i])
      prevContext = context
      context = context.setKeyInternal(
        path[i],
        i === pathLengthCompare ? val : {},
        context[path[i]],
        event,
        true
      )
      // prevContext.clearContext()
      if (!context) {
        context = prevContext[path[i]]
      }
    }
  }
  console.log('!!!!', level, cntx)
  // cntx
  // this.clearContext()
  // this._parent.clearContext()
  // its the firer that goes wrong in this case
  // cancel event on it
  // problem is when resolving all nested have to removed from event
  this.clearContextUp(level) //wrong! this._contextLevel
  // var parent = this._parent
  // while(parent) {
  //   console.log(parent.uid)
  //   parent = parent._parent
  // }
  // console.log()
  // if (event[this.uid], event.stamp) {
  //   for (var uid in event) {
  //     if (typeof event[uid] === 'object') {
  //       // console.log()
  //       console.log('got siome!', Object.keys(event[uid]))
  //     }
  //   }
  //   console.log('no g!')
  // }
  // console.log(Object.keys(event), Object.getPrototypeOf(this).uid, event.stamp)
  console.log('rc end')
  return context
}
