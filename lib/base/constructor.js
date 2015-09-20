"use strict";

var Base = require('./')

exports.setParent = function( val, event, parent, key ) {
  if( parent ) {
    this._parent = parent
  } else if( this._parent ) {
    this._parent = null
  }
  if( key !== void 0 ) {
    this.key = key
  }
}

exports.ChildConstructor = Base

exports.generateConstructor = function() {
  return (function derivedBase() {
    this.clearContext()
    Base.apply( this, arguments )
  })
}

exports.Constructor = {
  set:function( val ) {
    this._Constructor = val
  },
  get:function() {
    if( !this.hasOwnProperty( '_Constructor' ) ) {
      for( var key in this ) {
        if( key[0]!=='_' && !this['_'+key] ) {
          this.createContextGetter.call( this, key )
        }
      }
      this._Constructor = this.generateConstructor()
      this._Constructor.prototype = this
    }
    return this._Constructor
  }
}
