"use strict";

module.exports = exports = function Base( val, parent ) {
  this.$parent = parent
  this.$set( val )
}

var proto = exports.prototype
var define = Object.defineProperty

define( proto, '$fromBase', {
  get:function() {
    return this.__proto__
  }
})

define( proto, '$children', {
  value:{
    $Constructor: exports 
  },
  writable:true 
})

define( proto, '$getVal', {
  value:function() { 
  }
})

define( proto , '$val', {
  get:function() {
    return this.$getVal()
  },
  set:function(val) {

  }
})

define( proto, '$set', { value: function( val ) {
    if(val instanceof Object) {
      for( var key$ in val ) {
        this.$setKey( key$, val[key$] )
      }
    } else {
      this._$val = val
    }
  }
})

define( proto, '$setKey', {
  //hier moet ook iets in als hasownprop constructor (if used a a constructor)
  //guards voor ik maak iets nieuws make getter to update insatcnes correctly as well

  value:function( key, value ) {
    if(this[key] && this[key].$parent !== this) {
      this[key] = new this[key].$Constructor( value, this )
    } else if(this[key]) {
      this[key].$set( value )
    } else {
      this[key] = new this.$children.$Constructor( value, this )
      this[key]._name = key 
    }
  }
})

define( proto, '$Constructor', {
  set:function(val) {
    //overwrite defaults!
  },
  get:function() {
    if(!this.hasOwnProperty( '_$Constructor' )) {
      

      //dit maakt alles ultra slows 3x slower hellaas....

      for(var key$ in this) {
        if(key$[0]!=='_' && !this['_'+key$]) {
          this.$createContextGetter.call(this, key$)
        }
      }

      define(this, '_$Constructor', {
        value:function derivedBase( val, parent) {
          this.$parent = parent
          if(val) {
            this.$set( val )
          }
        }
      })
      this._$Constructor.prototype = this
    }
    return this._$Constructor
  }
})

require('./util')
require('./path')
// require('./get')
