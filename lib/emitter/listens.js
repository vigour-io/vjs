"use strict";
var Base = require('../base')

var ListensStore = module.exports = new Base({
  $define: {
    $createContextGetter: function(){}
  },
  $useVal:true
}).$Constructor

//test perf it is maybe faster with an if an one function

ListensStore.ListensOnPasson = new ListensStore({
  $define: {
    $removeProperty: function( property, key ) {
      if( key[0]!== '_' ) {
        var store = property.$passon
        for( var key$ in store ) {
          if( store[key$] && store[key$][1] === this._$parent ) {
            store.$removeProperty( store[key$], key$ )
          }
        }
      }
      this[key] = null
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
      this[key] = null
    }
  }
}).$Constructor