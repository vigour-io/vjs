"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

//operators and get flow

define( proto, '$getVal', {
  value:function() { 

  }
})

define( proto , '$val', {
  get:function() {
    return this.$getVal()
  },
  set:function( val ) {
    this.$set( val )
  }
})

define( proto , '$operators', {
  value: {
    add:function() {

    },
    transform: function() {

    }
  },
  writable: true,
  configurable: true
})