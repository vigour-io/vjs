'use strict'
var Base = require('../base')
var util = require('../util')

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
      cleanListens(property, 'listensOnBase', this)
      removeProperty.call(this, property, key, blockRemove)
    }
  }
})

function cleanListens (property, field, storage) {
  if (property instanceof Base) {
    var emitter = storage._parent

    removeFromListens(property[field], emitter)
  }
}

function removeFromListens (listens, emitter) {
  if (listens) {
    for (var i in listens) {
      if (i[0] !== '_') {
        if (listens[i] === emitter) {
          delete listens[i]
        }
      }
    }
  }
}

function removeProperty (property, key, blockRemove) {
  if (this[key] !== null) {
    this[key] = null
    if (key[0] !== '_' && util.isEmpty(this) && this._parent && !blockRemove) {
      this._parent.removeProperty(this, this.key)
    }
  }
}

// injectable part of module
exports.ChildConstructor = Storage

exports.properties = {
  attach: attach,
  base: BaseStorage
}
