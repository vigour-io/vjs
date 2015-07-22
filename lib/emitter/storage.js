"use strict";
var Base = require('../base')
var util = require('../util')
var removeFromListens = require('./shared').removeFromListens

//make injectable

var Storage = new Base({
  $define: {
    $removeProperty: removeProperty
  }
}).$Constructor

var Passon = new Storage({
  $define: {
    $removeProperty: function( property, key ) {
      if( property ) {
        cleanListens( property[1], '$listensOnPasson', this )
      }
      removeProperty.call( this, property, key )
    }
  }
})

var BaseStorage = new Storage({
  $define: {
    $removeProperty: function( property, key ) {
      cleanListens( property, '$listensOnBase', this )
      removeProperty.call( this, property, key )
    }
  }
})

function cleanListens( property, field, storage ) {
  if( property instanceof Base ) {
    var emitter = storage._$parent
    removeFromListens( property[field], emitter )
  }
}

function removeProperty( property, key ) {
  if( this[key] !== null ) {
    this[key] = null
    if( key[0] !== '_' && util.isEmpty(this) && this._$parent ) {
      this._$parent.$removeProperty( this, this._$key )
    } 
  }
}

//----injectable part of module-----
exports.$define = {
  $ChildConstructor: Storage
}

exports.$flags = {
  $passon: Passon,
  $base: BaseStorage
}

