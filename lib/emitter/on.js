'use strict'
var Base = require('../base')
var isPlainObj = require('../util/is/plainobj')
var isNumberLike = require('../util/is/numberlike')
var shared = require('./shared')
var generateId = shared.generateId
var ListensOn = require('./listens')
var ListensOnattach = ListensOn.ListensOnattach
var ListensOnBase = ListensOn.ListensOnBase
var removeKeyFromOtherStores = shared.removeKeyFromOtherStores

// next thing to resturcture and clean can become a lot nicer
exports.define = {
  on (val, key, unique, event, once) {
    var id
    if (!key) {
      key = generateId(this, val)
    }
    // find key in all stores
    if (typeof val === 'function') {
      add(this, 'fn', val, key, unique, event)
    } else if (val instanceof Base) {
      if (!add(this, 'base', val, key, unique || true, event)) {
        if (!val.listensOnBase) {
          val.setKeyInternal('listensOnBase', new ListensOnBase(), false)
        } else if (!val.hasOwnProperty('listensOnBase')) {
          val.setKeyInternal('listensOnBase', new val.listensOnBase.Constructor(), false)
        }
        let listensOnBase = val.listensOnBase
        id = generateId(listensOnBase)
        listensOnBase[id] = this
      }
    } else if (val instanceof Array) {
      if (!add(this, 'attach', val, key, unique, event)) {
        if (val.length > 2) {
          val[2] = val.slice(1)
          val = val.slice(0, 2)
        }
        let passedOnBased = val[1]
        if (passedOnBased instanceof Base) {
          if (!passedOnBased.listensOnAttach) {
            passedOnBased
              .setKeyInternal('listensOnAttach', new ListensOnattach(), false)
          } else if (!passedOnBased.hasOwnProperty('listensOnAttach')) {
            passedOnBased
              .setKeyInternal('listensOnAttach', new passedOnBased.listensOnAttach.Constructor(), false)
          }
          let listensOnAttach = passedOnBased.listensOnAttach
          id = generateId(listensOnAttach)
          listensOnAttach[id] = this
        }
      }
    } else {
      add(this, 'setListeners', val, key, unique, event)
    }
  },
  set (val, event, nocontext) {
    if (!val) {
      return this
    } else if (isPlainObj(val) && !(val instanceof Array)) {
      set(this, val, event, nocontext)
    } else {
      this.on(val, 'val', void 0, event)
    }
    return this
  }
}

function set (emitter, val, event, nocontext) {
  let props = emitter._properties
  for (let key in val) {
    if (props[key]) {
      props[key].call(emitter, val[key], event, nocontext, key)
    } else {
      if (!emitter._id && isNumberLike(key)) {
        emitter._id = Number(key)
      }
      emitter.on(val[key], key, void 0, event)
    }
  }
}

function add (emitter, type, val, key, unique, event) {
  // this can be gone mostly by using set normal resolvecontext
  var emitterType = emitter[type]
  if (!emitterType) {
    emitter.setKey(type, {}, false)
  } else if (unique) {
    var isFn = typeof unique === 'function'
    var stop
    if (isFn) {
      emitterType.each(function (listener) {
        if (!unique.call(emitter, listener, val)) {
          return (stop = true)
        }
      })
    } else {
      if (type === 'attach' && unique === true) {
        // way to slow of course... needs to use uids for attaches
        emitterType.each(function (listener) {
          if (listener[1] === val[1]) {
            return (stop = true)
          }
        })
      } if (type === 'base' && typeof key !== 'string') {
        stop = emitterType[key]
      } else {
        emitterType.each(function (listener) {
          if (listener === val) {
            return (stop = true)
          }
        })
      }
    }
    if (stop) {
      return true
    }
  }

  if (!emitter.hasOwnProperty(type)) {
    emitter.setKey(type, {}, false)
  }

  if (event) {
    // make this configurable
    val._ignoreStamp = event.stamp
  }
  // also check for remove
  // _val is parse val wrong!

  if (emitter[type][key]) {
    emitter[type].removeProperty(emitter[type][key], key, true)
  }

  removeKeyFromOtherStores(key, type, emitter)
  emitter[type][key] = val
}
