"use strict";

var Base = require('./')

exports.setParent = function( val, event, parent, key ) {
  if( parent ) {
    this._$parent = parent
  } else if( this._$parent ) {
    this._$parent = null
  }
  if( key !== void 0 ) {
    this.$key = key
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
    this._$Constructor = val
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
