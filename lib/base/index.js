"use strict";

module.exports = exports = function Base( val, parent ) {
  if(parent) {
    this._$parent = parent
  }
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
        this.$setKey( key$, val[key$] )
      }
    } else {
      this._$val = val
    }
  }
})

define( proto, '$setKeyInternal', {
  value:function( key, value, field ) {
    if(field) {
      if(field._$parent !== this) {
        this[key] = new field.$Constructor( value, this )
      } else {
        field.$set( value )
      }
    } else {
      //HIER CHECKEN OF HET EEN _ FIELD IS! if so extensions maken! (word geinherit)
      this[key] = new this.$children.$Constructor( value, this )
      this[key]._$key = key 
    }
  }
})

define( proto, '$setKey', {
  value:function( key, value ) {
    var added = '_'+key
    var field = this[added]
    if(field) {
      key = added
    } else {
      field = this[key]
    }
    this.$setKeyInternal( key, value, field )
  }
})

define( proto, '$Constructor', {
  set:function(val) {
    //overwrite defaults!
  },
  get:function() {
    if(!this.hasOwnProperty( '_$Constructor' )) {

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
