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
        
        var instances = this._instances

        if(instances) {

          if(!this._$parent) {
            throw new Error( 'should have a parent - resolving instances' )
          }
          
          var Constructor = this._$parent._$Constructor
          var newInstances

          for( var i = 0, length = instances.length; i < length; i++ ) {
            var instance = instances[i]
            if( Constructor && (instance instanceof Constructor) ) {
              if(!newInstances) {
                newInstances = []
              }
              newInstances.push(instance)
              //remove it since the new constructor will become the handler
              this._instances.splice(i,1)
            }
          }
          this._instances = newInstances
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
    $newParent: function( parent, event ) {
      if(this.$change && this.$change.$onBase) {
        console.error('ok base lets resolve can fix it when remove')
        parent.$setKeyInternal( '$on', void 0, this, event )
        parent.$on.$setKeyInternal( '$change', {}, parent.$on.$change, event )

        //this is temp fix remove to fix
        parent.$on.$change.$onBase = false

        console.log('done', parent.$on.$change === this.$change )

      }

      if(!this._instances) {
        this._instances = [] 
      } 
      if(parent !== this._$parent) {
        this._instances.push( parent )
      }
      
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
