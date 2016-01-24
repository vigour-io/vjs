'use strict'
var Base = require('../base')
var isEmpty = require('../util/is/empty')
var Storage = new Base({
  noContext: true,
  define: {
    removeProperty: removeProperty,
    val: {
      value: void 0,
      writable: true
    }
  }
}).Constructor

var attach = new Storage({
  define: {
    removeProperty: function (property, key, blockRemove) {
      global.xx && console.log('               4. ',key)
      var base = property && property[1]

      global.xx && console.log('                 5. ', !!base)
      if (base) {
        global.xx && console.log('           lets go!')
        cleanListens(base, 'listensOnAttach', this)
      }
      global.xx && console.log('is it you????')
      removeProperty.call(this, property, key, blockRemove)
    }
  }
})

var baseStorage = new Storage({
  define: {
    removeProperty: function (property, key, blockRemove) {
      cleanListens(property, 'listensOnBase', this, true)
      removeProperty.call(this, property, key, blockRemove)
    }
  }
})

function cleanListens (property, field, storage, base) {
  if (property instanceof Base) {
    let emitter = storage._parent
    // global.xx && console.log('           ', field, !emitter && '!!!!!')
    removeFromListens(property[field], emitter, base)
  }
}

function removeFromListens (listens, emitter, base) {
  // need event!
  if (listens) {
    for (let i in listens) {
      if (i[0] !== '_') {
        if (listens[i] === emitter) {
          global.xx && console.log('           ', i)
          delete listens[i]
          if (base && emitter._parent && listens._parent._input === emitter._parent._parent) {
            listens._parent._input = void 0
          }
        }
      }
    }
  }
}

function removeProperty (property, key, blockRemove) {
  if (this[key] !== null && key !== '_Constructor') {
    let thisKey = this.key
    this[key] = null
    global.xx && console.log(this.lookUp('scope'), Object.getPrototypeOf(this).lookUp('scope'))
    global.xx && console.log('                xxxx 6. is it you????', key, thisKey)
    global.xx && console.log(this[key], !!Object.getPrototypeOf(this)[key])

    if (global.xx && Object.getPrototypeOf(this)[key]) {
      var piv = Object.getPrototypeOf(this)
    console.log('FUCK FACE!', key, piv.path, piv.lookUp('scope'), piv[key] && piv[key][0] && !!piv[key][1])
    // piv.clearContextUp()
    // piv._parent.removeProperty(this, thisKey, false, true)
    // piv[key]
      // piv._parent.off(key, true)
       // Object.getPrototypeOf(this)._parent.removeProperty(Object.getPrototypeOf(this), thisKey)
    }
    // if unsubscribing --- do something special here or handle it yourself in unsubscribe :/
    // bascilly for unsubscribe need to do find over contexts
    // if (Object.getPrototypeOf(this)[key]) {

    // }
    // Object.getPrototypeOf(this)[key] =
    // this is where it goes 10 double fucked for attach this is a total nightmare
    // so what exactly happens
    // it adds the client to the original??? then what...thats the most bizarre thing ever

    if (key[0] !== '_' && isEmpty(this) && this._parent && !blockRemove) {
      if (this._parent.onRemoveProperty) {
        this._parent.onRemoveProperty(this, thisKey) //pretty nice when making a subs observable
      }

      this._parent.removeProperty(this, thisKey, false, true)
    }
  }
}

// injectable part of module
exports.ChildConstructor = Storage

exports.properties = {
  attach: attach,
  base: baseStorage
}
