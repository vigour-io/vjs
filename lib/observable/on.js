"use strict";

var Base = require('../base')
var Emitter = require('../emitter') 
var util = require('../util')
var removeInternal = Base.prototype.$removeInternal


//-----------injectable part of the module----------

exports.$flags = {
  $on: require('./onConstructor')
}

exports.$define = {
  on: function( type, val, key, unique, event ) {
    if( typeof type !== 'string' ) {
      return this.on( '$change', type, val, key, unique )
    } else {
      if( !this.$on || !this.$on[type] ) {
        var set = { $on: {} }
        set.$on[type] = {}
        this.$set( set, event || false )
      }
     this.$on[type].$addListener( val, key, unique, event )
    }
  }
}



