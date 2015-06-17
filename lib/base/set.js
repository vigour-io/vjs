"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var Flags = function(){}
var flagProto = Flags.prototype

//dit word een ding --- inheritable setting (voor $constructors en $flags)

function setKeyFlagHelper( Constructor, key, val, privateField ) {
  var field = this[ privateField ]
  if(field) {
    this.$setKeyInternal( privateField, new Constructor(val), field )
  } else {
    this.$setKeyInternal( key, new Constructor(val), this[key] )
  }
}

function flagConstructorHelper(Constructor, key) {
  Constructor.prototype._$useVal = true
  var privatefield =  '_'+key
  return function constructorHelper(val) {
    setKeyFlagHelper.call( this, Constructor, key, val, privatefield )
  }
}

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
    var flag = val[key$]
    if(flag instanceof Base) {
      flag = flag.$Constructor
    } 
    if(flag.prototype instanceof Base) {
      flags[key$] = flagConstructorHelper(flag, key$)
    } else {
      flags[key$] = val[key$]
    }
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

//!!!!! this will become something like 'constructor' or child constructor
define( proto, '$ChildConstructor', {
  value:Base ,
  configurable:true
})
//if overwrite make sure its defined non-enum afterwards
//!!!! replace this later

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
      var useVal = val && ( val._$useVal || val.$useVal )
      var ready

      if(useVal) {
        val = useVal === true 
            ? val 
            : useVal
       
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





