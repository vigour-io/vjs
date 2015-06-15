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
    var val = this._$val
    if(val) {
      //special flag dat functie niet geget moet worden
      //dit is voor methods
      if(typeof val === 'function') {
        var $context = this._$getterContext
        //pretty lame that getterContext still has _$val seems extra
        //ook uit kunnen zetten dan krijg je gewoon de functie terug
        //lets make this nice later!
        //also add $path functionality
        //'$parent.$parent.blurf' this is very usefull for the $field flag
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
        return val.call($context || this)
      } else if( val instanceof Base ) {
        return val.$val
      } else {
        return this._$val
      }
      
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