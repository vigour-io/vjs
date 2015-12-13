'use strict'
var Base = require('../base')
var isEmpty = require('../util/is/empty')
var Storage = new Base({
  define: {
    removeProperty: removeProperty,
    val: {
      // val is used as a normal key in storage objects
      value: void 0,
      writable: true
    }
  }
}).Constructor

var attach = new Storage({
  define: {
    removeProperty: function (property, key, blockRemove) {
      var base = property && property[1]
      if (base) {
        cleanListens(base, 'listensOnAttach', this)
      }
      removeProperty.call(this, property, key, blockRemove)
    }
  }
})

var BaseStorage = new Storage({
  define: {
    removeProperty: function (property, key, blockRemove) {
      // need event!
      cleanListens(property, 'listensOnBase', this, true)
      removeProperty.call(this, property, key, blockRemove)
    }
  }
})

function cleanListens (property, field, storage, base) {
  if (property instanceof Base) {
    let emitter = storage._parent
    removeFromListens(property[field], emitter, base)
  }
}

function removeFromListens (listens, emitter, base) {
  // need event!
  if (listens) {
    for (let i in listens) {
      if (i[0] !== '_') {
        if (listens[i] === emitter) {
          delete listens[i]

          // only for base of course!
          if (base && emitter._parent && listens._parent._input === emitter._parent._parent) {
            // listens._parent.set(void 0)
            listens._parent._input = void 0
            // need to emit probably
          }
        }
      }
    }
  }
}

function removeProperty (property, key, blockRemove) {
  if (this[key] !== null) {
    let thisKey = this.key
    this[key] = null
    if (key[0] !== '_' && isEmpty(this) && this._parent && !blockRemove) {
      this._parent.removeProperty(this, thisKey)
    }
  }
}

// injectable part of module
exports.ChildConstructor = Storage

exports.properties = {
  attach: attach,
  base: BaseStorage
}
