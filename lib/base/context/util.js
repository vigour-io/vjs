"use strict";

exports.$clearContextUp = function( level ) {
  var parent = this
  var i = 0
  while( parent && (!level||i<level) ) {
    i++
    parent.$clearContext()
    parent = parent._$parent
  }
}

exports.$clearContext = function() {
  if( this._$context ) {
    this._$contextLevel = null
    this._$context = null
  }
  return this
}

exports.$storeContext = function() {
  // this._$storedContext = this._$context
  // this._$storedLevel = this._$contextLevel
  return {
    context: this._$context,
    level: this._$contextLevel
  }
}

exports.$restoreContext = function( storedContext, level, dontClear ) {
  var target
  var i
  storedContext = storedContext || this._$storedContext
  if( storedContext ) {
    level = level || this._$storedLevel || 1
    target = this
    for( i = 0; i < level && target; i++ ) {
      target._$contextLevel = (level-i) || null
      target._$context = storedContext
      target = this._$parent
    }
    if(!dontClear) {
      this._$storedLevel = null
      this._$storedContext = null
    }
  } else {
    this.$clearContextUp()
  }
}
