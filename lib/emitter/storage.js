"use strict";
var Base = require('../base')
var util = require('../util')
var removeFromListens = require('./shared').removeFromListens

var Storage = new Base({
  $define: {
    $removeProperty: removeProperty
  }
}).$Constructor

var attach = new Storage({
  $define: {
    $removeProperty: function( property, key, blockRemove ) {
      if( property && property[1] ) {
        cleanListens( property[1], '$listensOnAttach', this )
      }
      removeProperty.call( this, property, key, blockRemove )
    }
  }
})

var BaseStorage = new Storage({
  $define: {
    $removeProperty: function( property, key, blockRemove ) {
      cleanListens( property, '$listensOnBase', this )
      removeProperty.call( this, property, key, blockRemove )
    }
  }
})

function cleanListens( property, field, storage ) {
  if( property instanceof Base ) {
    var emitter = storage._$parent
    removeFromListens( property[field], emitter )
  }
}

function removeProperty( property, key, blockRemove ) {
  if( this[key] !== null ) {
    this[key] = null
    if( key[0] !== '_' && util.isEmpty(this) && this._$parent && !blockRemove ) {
      this._$parent.$removeProperty( this, this.$key )
    }
  }
}

//----injectable part of module-----
exports.$define = {
  $ChildConstructor: Storage
}

exports.$flags = {
  $attach: attach,
  $base: BaseStorage
}
