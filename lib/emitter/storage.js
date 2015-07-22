"use strict";
var Base = require('../base')
var util = require('../util')
var removeFromListens = require('./shared').removeFromListens

//make injectable

var Storage = module.exports = new Base({
  $define: {
    $removeProperty: function( property, key ) {
      this[key] = null

      console.log( key, util.isEmpty(this) )
      if( key[0] !== '_' && util.isEmpty(this) && this._$parent ) {
        this._$parent.$removeProperty( this, this._$key)
      } 
    }
  }
}).$Constructor

Storage.Passon = new Storage({
  $define: {
    $removeProperty: function( property, key ) {
      if( property[1] instanceof Base ) {
        var emitter = this._$parent
        removeFromListens( property[1].$listensOnPasson, emitter )
      }
      this[key] = null
    }
  }
})

Storage.Base = new Storage({
  $define: {
    $removeProperty: function( property, key ) {
      if( property instanceof Base ) {
        var emitter = this._$parent
        removeFromListens( property.$listensOnBase, emitter )
      }
      this[key] = null
    }
  }
})