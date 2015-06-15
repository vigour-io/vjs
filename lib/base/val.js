"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

//operators and get flow

define( proto, '$getVal', {
  value:function() { 
    if(this._$val) {
      if(typeof this._$val === 'function') {
        return this._$val.call(this)
      } 

      //handle references
      return this._$val
    } else {
      return this
    }
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

// define( proto , '$operators', {
//   value: {},
//   writable: true,
//   configurable: true
// })

//everything needs configurable: true
//make our own define( merges a descriptor object /w configurable)