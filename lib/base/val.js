"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

//operators and get flow

define( proto, '_$getterContext', {
  writable:true,
  configurable:true
})

define( proto, '$getVal', {
  value:function() { 
    if(this._$val) {
      if(typeof this._$val === 'function') {
        var $context = this._$getterContext


        //lets make this nice later!
        
        if($context) {
          // console.log('lets resolve', this._$getterContext)
          if(this._$getterContext._$val === '$parent') {
            $context = this.$parent
          } else if(typeof this._$getterContext._$val=== 'function' ) {
            $context = this._$getterContext._$val.call(this)
          } else {
            $context = this
          }
        }

        return this._$val.call($context || this)
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