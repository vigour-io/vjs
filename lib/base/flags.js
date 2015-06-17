// flags.js
"use strict";
var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var Flags = function(){}
var flagProto = Flags.prototype

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