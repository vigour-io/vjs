"use strict";

exports.$resetContextsUp = function( diff ) {
  var parent = this
  if( !diff ) {
    while( parent ) {
      parent.$clearContext()
      parent = parent._$parent
    }
  } else {
    var i = 0
    while( parent ) {
      if( diff[i] ) {
        parent._$context = diff[i]
        parent._$contextLevel = i
      } else {
        parent.$clearContext()
      }
      i++
      parent = parent._$parent
    }
  }
}

exports.$clearContext = function() {
  if( this._$context ) {
    this._$contextLevel = null
    this._$context = null
  }
  return this
}
