"use strict";
var Base = require('../base')
var util = require('../util')

var ListensStore = module.exports = new Base({
  $define: {
    $createContextGetter: function(){}
  },
  $useVal:true
}).$Constructor

//test perf it is maybe faster with an if an one function

ListensStore.ListensOnattach = new ListensStore({
  $define: {
    $removeProperty: function( property, key ) {
      if( key[0]!== '_' ) {
        var store = property.$attach
        for( var key$ in store ) {
          if( store[key$] && store[key$][1] === this._$parent ) {
            store.$removeProperty( store[key$], key$ )
          }
        }
      }
      this[key] = null
      // later cleans up the listens stores
      // removeProperty.call( this, property, key )
    }
  }
}).$Constructor

ListensStore.ListensOnBase = new ListensStore({
  $define: {
    $removeProperty: function( property, key ) {
      if( key[0]!== '_' ) {
        var store = property.$base
        for( var key$ in store ) {
          if( store[key$] && store[key$] === this._$parent ) {

            store.$removeProperty( store[key$], key$ )
          }
        }
      }

      if(key!=='_$parent' && key !== '$key' ) {
        this[ key ] = null
      }
      // removeProperty.call( this, property, key )
    }
  }
}).$Constructor

//removing the listnes on (do this later!)
// function removeProperty( property, key ) {
//   console.error('????', this.$path, key, property)
//   if( this[key] !== null ) {
//     this[key] = null
//     if( key[0] !== '_' && util.isEmpty(this) && this._$parent ) {
//       this._$parent.$removeProperty( this, this.$key, false )
//     }
//   }
// }
