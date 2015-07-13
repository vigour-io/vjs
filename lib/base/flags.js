"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var Flags = module.exports = function(){}
var flagProto = Flags.prototype

//$flags are bascily setters now maybe make it into propertyDescriptors

Flags.$ConstructorHelper = function flagConstructorHelper(Constructor, key) {
  var proto = Constructor.prototype
  proto._$useVal = true
  if(!proto._$key) { 
    proto._$key = key
  }

  //this can become a lot lighter (share method for example)
  return function constructorHelper( val, event ) {
    var flag = this[key]
    if(!flag) {
      this.$setKeyInternal( key, 
        new Constructor( val, event, void 0, key ), 
        void 0, event 
      )
    } else {
      return this.$setKeyInternal( key, val, flag, event )
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
      flags[key$] = Flags.$ConstructorHelper( flag, key$ )
    } else if( typeof flag ==='function' ) {
      flags[key$] = flag
    } else {
      console.warn('flags - custom objects are not supported yet')
    }
  }
}

//__$bind__ means the current vObj flags are bound to
flagProto.__$bind__ = Base

//
proto._$flags = new Flags()

define( proto, '$flags', {
  get:function() {
    return this._$flags
  },
  set:function( val ) {
    this._$flags.$flags.call(this, val)
  },
  configurable:true
})

//maybe make define /w with setKeyFlags
//and definitions
