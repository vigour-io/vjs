"use strict";

var Base = require('./')

exports.setParent = function( val, event, parent, key ) {
  if( parent ) {
    this._$parent = parent
  }
  if( key !== void 0 ) {
    this._$key = key
  }
}

exports.$ChildConstructor = Base

exports.$generateConstructor = function() {
  return (function derivedBase() {
    this.$clearContext()
    Base.apply( this, arguments )
  })
}

exports.$Constructor = {
  set:function( val ) {
    this._$generateConstructor = val
  },
  get:function() {
    if( !this.hasOwnProperty( '_$Constructor' ) ) {
      for( var key$ in this ) {
        if( key$[0]!=='_' && !this['_'+key$] ) {
          this.$createContextGetter.call( this, key$ )
        }
      }
      this._$Constructor = this.$generateConstructor()
      this._$Constructor.prototype = this
    }
    return this._$Constructor
  }
}
