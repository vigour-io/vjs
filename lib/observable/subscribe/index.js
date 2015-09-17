"use strict";
var hash = require( '../../util/hash' )
var SubsEmitter = require('./constructor')

//add on addition get by pattern (auto hash)

exports.$define = {
  subscribe: function( pattern, val, key, unique, event ) {
    console.error('???subscribing????', pattern)
    //TODO cache the stringified
    var stringified = JSON.stringify( pattern )
    var hashed = hash( stringified )
    var setObj
    if( !this.$on || !this.$on[ hash ] ) {
      setObj = {
        $on: {}
      }
      setObj.$on[ hashed ] = new SubsEmitter()
      this.set( setObj )
      this.$on[ hashed ].set( {
        $pattern: pattern
      }, event )
    }
    this.on( hashed, val, key, unique, event )
    return this.$on[ hashed ]
  }
}
