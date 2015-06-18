"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var flags = require('./flags.js')

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

proto.$flags = {
  $useVal:function(val) {
    this._$useVal = val
  },
  $key:function(val) {
    this._$key = val
  }
}

define( proto, '$setKeyInternal', {
  value:function( key, val, field ) {
    if(field) {
      if(field._$parent !== this) {
        this[key] = new field.$Constructor( val, this )
      } else {
        field.$set( val )
      }
    } else {

      //!!!! OPTMIZE THIS BULLSHIT ITS VERY DIRTY
      // if(val) {

      var ready
      if(val !== void 0){
        var useVal = val._$useVal || val.$useVal
        if(useVal) {
          val = useVal === true ? val : useVal
          if(val instanceof Base) {
            if(!val._$parent) {
              val._$key = key
              val._$parent = this
              this[key] = val
              ready = true
            }
          } else {
            this[key] = val
            ready = true
          }
        }
      } 

      if(!ready) {
        this[key] = new this.$ChildConstructor( val, this, key )
      }

      if(this.hasOwnProperty( '_$Constructor' )) {
        this.$createContextGetter.call(this, key)
      }
      //!!!! OPTMIZE THIS!
    }
  }
})

define( proto, '$setKey', {
  value:function( key, value ) {
    if( this.$flags[key] ) {
      this.$flags[key].call( this, value )
    } else {
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





