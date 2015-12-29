'use strict'
// var Base = require('../')
var define = Object.defineProperty

global.activeContexts = {
  toString () {
    var cnt = 0
    var str = ''
    for (var i in this) {
      for (var j in this[i]) {
        if (j !== 'val') {
          if (this[i][j].path.indexOf('_on') < 0) {
            cnt++
            str += '\n CONTEXT: ' + (this[i].val && this[i].val._path.join('.'))
            str += '\n             ----> ' + this[i][j].path
          }
        }
      }
    }
    str += '\n TOTAL: ' + cnt
    return str
  }
}

global.contextChange = function () {

}

exports._context = {
  get () {
    return this.__context
  },
  set (val) {
    if (val) {
      if (!global.activeContexts[val.uid]) {
        global.activeContexts[val.uid] = {
          val: val
        }
        if (!global.disable) {
          global.disable = true
          global.contextChange(val)
          global.disable = false
        }
      }
      global.activeContexts[val.uid][this.uid] = {
        path: this._path.join('.')
      }
    } else if (this.__context) {
      if (!global.disable) {
        global.disable = true
        global.contextChange(val)
        global.disable = false
      }
      delete global.activeContexts[this.__context.uid][this.uid]
    }
    this.__context = val
  }
}

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
  console.log('lets resolve bitch', val)
  context = context || this._context
  if (context._context) {
    context = context.resolveContext(void 0, event, context._context, true)
  }
  var iterator = this
  var path = [] // again same thing reuse path here not allways make
  var prevContext

  while (iterator && iterator !== context && iterator.key) {
    // this is so fucked whats wrong with the === check should be enought! godaaam
    var key = iterator.key
    path.unshift(key) // make better -- do loop trough path here directly
    iterator = iterator._parent
  }

  var pathLength = path.length
  var pathLengthCompare = pathLength - 1

  for (let i = 0; i < pathLength; i++) {
    if (context) {
      console.log(i, path[i])
      // context.clearContext()
      prevContext = context
      context._context = null
      console.log('do it now!')
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
  console.log('lets resolve bitch', context)
  // this.clearContextUp() //fucker bitch
  return context
}
