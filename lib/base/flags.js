"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var Flags = module.exports = function(){}
var flagProto = Flags.prototype

function flagConstructorHelper(Constructor, key) {
  var proto = Constructor.prototype
  proto._$useVal = true
  if(!proto._$key) { 
    proto._$key = key
  }
  return function constructorHelper(val, event) {
    if(!this[key]) {
      this.$setKeyInternal( key, new Constructor( val, event ), this[key] )
    } else {
      this.$setKeyInternal( key, val, this[key] )
    }
  }
}

flagProto.$flags = function( val, event ) {
  if(!util.isPlainObj(val)) {
    throw new Error('$flags needs to be set with a plain object')
  }
  var flags = this._$flags
  if(flags.__$bind__ !== this) {
    var DerivedFlags = function(){}
    DerivedFlags.prototype = flags
    this._$flags = flags = new DerivedFlags()
    flags.__$bind__ = this
  } 
  for( var key$ in val ) {
    var flag = val[key$]
    if(flag instanceof Base) {
      flag = flag.$Constructor
    } 
    if(flag.prototype instanceof Base) {
      flags[key$] = flagConstructorHelper(flag, key$ )
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

