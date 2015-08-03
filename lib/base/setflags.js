"use strict";

var Base = require('./')
var util = require('../util')

var Flags = function(){}
var flagProto = Flags.prototype

//$flags are bascily setters now maybe make it into propertyDescriptors
//but only on .set

Flags.$ConstructorHelper = function flagConstructorHelper( Constructor, key ) {
  var proto = Constructor.prototype
  proto._$useVal = true
  if(!proto._$key) {
    proto._$key = key
  }

  //TODO: make this better dont need events all the time

  function setFlagConstructorHelper( val, event, nocontext ) {
    var flag = this[key]
    if(!flag) {
      this.$addNewProperty(
        key,
        //TODO: need to be able to get the event from new back!
        //origin has to be new prop allready created -- lost event
        new Constructor( val, event, this, key ),
        void 0,
        event || void 0
      )
    } else {
      return this.$setKeyInternal( key, val, flag, event, nocontext )
    }
  }
  setFlagConstructorHelper.$base = proto
  //this can become a lot lighter (share method for example)
  return setFlagConstructorHelper
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
    if( flag instanceof Base ) {
      flag = flag.$Constructor
    }
    this.$flagTypes.call( this, flags, flag, key$, val, event )
  }
}

//__$bind__ means the current vObj flags are bound to
flagProto.__$bind__ = Base

exports._$flags = {
  value: new Flags(),
  writable:true
}

exports.$flagTypes = function( flags, flag, key, val, event, nocontext ) {
  if( flag.prototype instanceof Base ) {
    flags[key] = Flags.$ConstructorHelper( flag, key )
  } else if( typeof flag ==='function' ) {
    flags[key] = flag
  } else {
    console.warn('flags - custom objects are not supported yet')
  }
}

exports.$flags = {
  get:function() {
    return this._$flags
  },
  set:function( val ) {
    this._$flags.$flags.call( this, val )
  }
}

//maybe make define /w with setKeyFlags
//and definitions
