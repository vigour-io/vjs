"use strict";

var Base = require('../../base')
var Emitter = require('../../emitter') 
var util = require('../../util')

var On = new Base({
  $key:'$on',
  $define: {
    $ChildConstructor: Emitter,
    $strictType: function( val ) {
      return (val instanceof Emitter)
    },
    $generateConstructor: function() {
      return (function On( val, event, parent, key ) {
        
        Base.call( this, val, event, parent, key )
        
        if(this._instances) {
          this._instances = null
        }
        
        var proto = this.__proto__

        if( proto._$parent ) {
          if( !proto._instances ) {
            proto._instances = []
          }
          proto._instances.push( this._$parent )
        }

      })
    },
    //this is dirty but not rly another way... on is not defined yet...
    //we can use this to emit newParent type at least
    $newParent: function( parent ) {
      if(!this._instances) {
        this._instances = [] 
      } 
      this._instances.push( parent )
    }
  },
  $flags: {
    $property: require('../../emitter/property'),
    $reference: require('../../emitter/reference')
  }
}).$Constructor

//-----------injectable part of the module----------

exports.$inject = require('./emit')

exports.$flags = {
  $on: On
}

exports.$define = {
  on: function( type, val, key, unique, event ) {
    if( !this.$on || !this.$on[type] ) {
      var set = { $on: {} }
      set.$on[type] = {}
      this.$set( set, event || false )
    }
    this.$on[type].$addListener( val, key, unique, event )
  }
}

