"use strict";

module.exports = exports = function Base( val, parent ) {
  if(parent) {
    this._$parent = parent
  }
  
  //replace $name /w key
  if(val) {
    this.$set( val )
  }
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
        //ook weer if !_ (irritant)
        this.$setKey( key$, val[key$] )
      }
    } else {
      this._$val = val
    }
  }
})

window.keyCnt = 0

define( proto, '$setKeyInternal', {
  value:function( key, value, field ) {
    if(field) {
      if(field._$parent !== this) {
        this[key] = new field.$Constructor( value, this )

        // this[key]._$context = null
        // this[key]._$contextPath = null
        // console.log('hello!', this.$path, key)
      } else {
        field.$set( value )
      }
    } else {
      this[key] = new this.$children.$Constructor( value, this )
      this[key]._$name = key 
    }
  }
})


define( proto, '$setKey', {
  //hier moet ook iets in als hasownprop constructor (if used a a constructor)
  //guards voor ik maak iets nieuws make getter to update insatcnes correctly as well
  // '_' + key removes getter from sets makes them way way faster
  // this is important since this is ofc the bottleneck (especially on the hub)
  value:function( key, value ) {

    var added = '_'+key
    var field = this[added]

    if(field) {
      key = added
    } else {
      field = this[key]
    }

    // this.$setKeyInternal( key, value, this[key] )
    this.$setKeyInternal( key, value, field )

  }
})

define( proto, '$Constructor', {
  set:function(val) {
    //overwrite defaults!
  },
  get:function() {
    if(!this.hasOwnProperty( '_$Constructor' )) {
      
      // dit maakt alles ultra slows 3x slower hellaas....
      // console.log('?')
      for(var key$ in this) {
        if(key$[0]!=='_' && !this['_'+key$]) {
          this.$createContextGetter.call(this, key$)
        }
      }

      define(this, '_$Constructor', {
        value:function derivedBase( val, parent ) {
          if(parent) {
            this._$parent = parent
          }
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
