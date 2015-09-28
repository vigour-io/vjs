'use strict'
var Base = require('../base')
var util = require('../util')
var isNumberLike = util.isNumberLike
var shared = require('./shared')
var generateId = shared.generateId
var ListensOn = require('./listens')
var ListensOnattach = ListensOn.ListensOnattach
var ListensOnBase = ListensOn.ListensOnBase
var removeKeyFromOtherStores = shared.removeKeyFromOtherStores

// next thing to resturcture and clean can become a lot nicer
exports.define = {
  on: function (val, key, unique, event) {
    var id
    if (!key) {
      key = generateId(this)
    }
    // find key in all stores
    if (typeof val === 'function') {
      add(this, 'fn', val, key, unique, event)
    } else if (val instanceof Base) {
      if (!add(this, 'base', val, key, unique || true, event)) {
        if (!val.listensOnBase) {
          val.setKeyInternal('listensOnBase', new ListensOnBase(), false)
        }
        var listensOnBase = val.listensOnBase
        id = generateId(listensOnBase)
        listensOnBase[id] = this
      }
    } else if (val instanceof Array) {
      if (!add(this, 'attach', val, key, unique, event)) {
        if (val[2]) {
          val[2] = val.slice(1)
          val = val.slice(0, 2)
        }
        var passedOnBased = val[1]
        if (passedOnBased instanceof Base) {
          if (!passedOnBased.listensOnAttach) {
            passedOnBased
              .setKeyInternal('listensOnAttach', new ListensOnattach(), false)
          }
          var listensOnAttach = passedOnBased.listensOnAttach
          id = generateId(listensOnAttach)
          listensOnAttach[id] = this
        }
      }
    } else {
      add(this, 'setListeners', val, key, unique, event)
    }
  },
  set: function (val, event, nocontext) {
    // can totaly be used in the normal way
    // context is also a lot clearer then
    // for now it does not matter since emitters only have nested properies (that you cant touch)
    if (util.isPlainObj(val) && !(val instanceof Array)) {
      for (var key in val) {
        var propertyDefinition = this._properties && this._properties[key]
        if (propertyDefinition) {
          propertyDefinition.call(this, val[key], event, nocontext, key)
        } else {
          if (isNumberLike(key)) {
            if (!this._id) {
              this._id = Number(key)
            }
          }
          this.on(val[key], key, void 0, event)
        }
      }
    } else {
      // uses each so  and _ fields get ignored (thats why val)
      this.on(val, 'val', void 0, event)
    }
    // this cannot be good
    // do normal set for it remove in on in obs and remove more in own on
    // should return context and stuff
    return this
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
          return true
        }
      })
    } else {
      emitterType.each(function (listener) {
        if (listener === val) {
          return true
        }
      })
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
