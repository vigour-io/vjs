"use strict";

exports.$clearContextUp = function( level ) {
  var parent = this
  var i = 0
  while( parent && (!level||i<level) ) {
    i++
    parent.$clearContext()
    parent = parent._$parent
  }
  return this
}

exports.$clearContext = function() {
  if( this._$context ) {
    this._$contextLevel = null
    this._$context = null
  }
  return this
}

//contextChain
exports.$clearContextChain = function() {
  var context = this._$context
  var temp
  while( context ) {
    temp = context._$context
    context.$clearContext()
    context = temp
  }
  return this
}

exports.$setContextChain = function( chain ) {
  var bind = chain[0].bind || this
  var iterator = bind
  for(var j in chain) {
    iterator._$context = chain[j].context
    iterator._$contextLevel = chain[j].level
    iterator = iterator._$context
  }
  if(iterator) {
    iterator.$clearContextUp()
  }
  //----fix this this is way to ugly....----
  var parent = bind.$parent
  while(parent) {
    parent = parent.$parent
  }
  //----------------------------------------
  return bind
}

exports.$storeContextChain = function() {
  var chain = [
    {
      context: this._$context,
      level: this._$contextLevel,
      bind: this
    }
  ]
  var contextUp
  contextUp = this._$context
  while(contextUp) {
    if(contextUp._$context) {
      chain.push({
        context: contextUp._$context,
        level: contextUp._$contextLevel
      })
    }
    contextUp = contextUp._$context
  }
  return chain
}
