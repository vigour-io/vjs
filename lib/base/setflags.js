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
  if(!proto.$key) {
    proto.$key = key
  }

  function setFlagConstructorHelper( val, event, nocontext ) {
    var flag = this[key]
    if(!flag) {

      // if(key==='$on') {
      // this[key] = new Constructor( void 0, false, this, key )

      this.$addNewProperty(
        key,
        new Constructor( void 0, event, this, key ),
        void 0,
        false//event || void 0
      )

      return this[key].set( val, event )
      // } else {
      //
      //   this.$addNewProperty(
      //     key,
      //     new Constructor( val, event, this, key ),
      //     void 0,
      //     event || void 0
      //   )
      //
      // }
    } else {
      return this.$setKeyInternal( key, val, flag, event, nocontext )
    }
  }
  setFlagConstructorHelper.$base = proto
  //TODO: this can become a lot lighter (share method for example)
  return setFlagConstructorHelper
}

flagProto.$flags = function( val, event ) {
  if(!util.isPlainObj(val)) {
    throw new Error('$flags needs to be set with a plain object')
  }
  var flags = this._$flags
  if(flags.$binds !== this) {
    var DerivedFlags = function(){}
    DerivedFlags.prototype = flags
    this._$flags = flags = new DerivedFlags()
    flags.$binds = this
  }
  for( var key$ in val ) {
    var flag = val[key$]
    if( flag instanceof Base ) {
      flag = flag.$Constructor
    }
    this.$flagTypes.call( this, flags, flag, key$, val, event )
  }
}

//$binds means the current vObj flags are bound to
flagProto.$binds = Base

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
    console.warn('flags - custom objects are not supported yet', flag)
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
