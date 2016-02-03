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
exports.resolveContext = function (val, event, context, target, path) {
  context = context || this._context
  var i = this._contextLevel
  var path
  var prevContext
  var level = i

  if (!target) {
    target = this
  }

  var iterator = target

  if (!path) {
    path = pathMaker(path, iterator, i)
  }

  console.log('... resolve ...', path)

  if (context._context) {
    // var p
    // if (!path) {
      // path = target.path
    // }
    // console.warn('how to handle this?', context.path, path)
    // var cntxp = context.path

    // path = path.slice(cntxp.length - 1)
    var cpath = pathMaker(false, context, context._contextLevel)

    console.log('---prepped', path, cpath)
    console.log('more context handle it correct from the top')

    context = context.resolveContext({}, event, context._context, target, cpath.concat(path))
    // console.log('oopsie have to resolve more!')
    // if (context._contextKey) {
      // return
    // }
    return
  }



  // var lp
  // make it into an object? when key


  console.log('---->', path)

  var pathLength = path.length
  var pathLengthCompare = pathLength - 1

  for (i = 0; i < pathLength; i++) {
    if (context) {
      prevContext = context
      if (pathLengthCompare) {
        // console.log(path[i])
      }

      let segment = path[i]
      let key = typeof segment === 'string' ? segment : segment.key
      let prop = segment.__contextTarget__ || context[key]
      let set
      let property

      if (i === pathLengthCompare) {
        console.warn('end point what is wrong here?', context._path)
        set = val
      } else {
        set = {}
      }

      // if(!prop && segment.__contextTarget__) {
      //   // set = new segment.__contextTarget__.Constructor(set, false, false, true)
      // }

      console.log('do it set context key ....', key, context)
      context = context.setKeyInternal(key, set, prop, event, true)
      if (!context) {
        context = prevContext[key]
      }
    }
  }
  this.clearContextUp(level)
  return context
}


function pathMaker (path, iterator, i) {
  path = path || []
  while (i) {
    let key = iterator.key
    console.log('ok now we habe to check for contextkey as well!', key)
    if (iterator._contextKey) {
      path.unshift({ key: key, __contextTarget__: iterator })
    } else {
      path.unshift(key)
    }
    // lp = iterator
    iterator = iterator._parent
    i--
  }
  return path
}