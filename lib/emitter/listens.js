"use strict";
var Base = require('../base')

var ListensStore = module.exports = new Base({
  $define: {
    $createContextGetter: function(){}
  },
  $useVal:true
}).$Constructor

ListensStore.ListensOnPasson = new ListensStore({
  $define: {
    $removeProperty: function( property, key ) {
      this[key] = null
    }
  }
}).$Constructor

ListensStore.ListensOnBase = new ListensStore({
  $define: {
    $removeProperty: function( property, key ) {
      this[key] = null
    }
  }
}).$Constructor