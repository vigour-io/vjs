"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var Flags = module.exports = function(){}
var flagProto = Flags.prototype

function setKeyFlagHelper( self, Constructor, key, val, privateField ) {
  var field = self[ privateField ]
  if(field) {
    self.$setKeyInternal( privateField, new Constructor(val), field )
  } else {
    self.$setKeyInternal( key, new Constructor(val), self[key] )
  }
}

function flagConstructorHelper(Constructor, key) {
  var proto = Constructor.prototype
  proto._$useVal = true
  if(!proto._$key) { 
    proto._$key = key
  }
  var privatefield = '_'+key
  return function constructorHelper(val) {
    setKeyFlagHelper( this, Constructor, key, val, privatefield )
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
    //this is wrong... unfortunately
    // DerivedFlags.prototype
    this._$flags = flags = new DerivedFlags()
    flags.__$bind__ = this
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

/**
 * @memberOf Base#
 * @name  $flags
 * @type {base}
 */
define( proto, '$flags', {
  get:function() {
    return this._$flags
  },
  set:function( val ) {
    this._$flags.$flags.call(this, val)
  }
})

