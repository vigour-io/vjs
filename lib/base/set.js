"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var Flags = function(){}
var flagProto = Flags.prototype

//dit word een ding --- inheritable setting (voor $constructors en $flags)

flagProto.$flags = function( val ) {
  if(!util.isPlainObj(val)) {
    throw new Error('$flags needs to be set with a plain object')
  }
  var flags = this._$flags
  if(flags.__$bind__ !== this) {
    var DerivedFlags = function(){}
    DerivedFlags.prototype = flags
    DerivedFlags.prototype.__$bind__ = this
    this._$flags = flags = new DerivedFlags()
  } 
  for( var key$ in val ) {
    flags[key$] = val[key$]
  }
}

//__$bind__ means the current vObj flags are bound to
flagProto.__$bind__ = Base

proto._$flags = new Flags()

define( proto, '$flags', {
  get:function() {
    return this._$flags
  },
  set:function( val ) {
    this._$flags.$flags.call(this, val)
  }
})

define( proto, '$children', {
  value:{
    $Constructor: Base 
  },
  writable:true 
})

define( proto, '$set', { 
  value: function( val ) {
    if(util.isPlainObj(val)) {
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
      //constructors --> dit is heel vaak nodig beetje beurs om zelf de setkey internal constant te maken bij
      //one more if to check if it does not need a $constructor?
      if(value.$override) {
        value = value.$override
        if(value instanceof Base) {
          value._$key = key
          value._$parent = this
        }
        this[key] = value
      } else {
        this[key] = new this.$children.$Constructor( value, this, key )
      }
      
      //getting correct contructor -- children can go away can become e.g. $constructor
      //adds 3% extra slowness (purely for the check)
      //try to remove constructor when instance is created and check if a normal if(!) is faster
      if(this.hasOwnProperty( '_$Constructor' )) {
        //this can be optimized
        this.$createContextGetter.call(this, key)
      }
    }
  }
})

define( proto, '$setKey', {
  value:function( key, value ) {
    if( this.$flags[key] ) {
      this.$flags[key].call( this, value )
    } else {

      //one more if? to check if it just has to add the thing?
      var privateField = '_'+key
      var field = this[ privateField ]
      if(field) {
        this.$setKeyInternal( privateField, value, field )
      } else {
        this.$setKeyInternal( key, value, this[key] )
      }
    } 
  }
})





