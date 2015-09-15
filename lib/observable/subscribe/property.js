"use strict";
var decodedLevel = require('./shared').decodedLevel

exports.$define = {
  $subscribeToProperty: function( property, val, key, event, refLevel, level, meta, original ) {

    console.log('%csubscribeToProperty --->','color:white;background:#333;', property._$path)

    var value = val[ key ]
    if( value === true ) {
      this.$addChangeListener( property, val, key, event, refLevel, level, meta, original )
      return true
    }
    if( typeof value === 'number' ) {
      if( decodedLevel( value ) >= level ) {
        console.log('hello!', original)
        this.$addChangeListener( property, val, key, event, refLevel, level, meta, original )
      }
      return true
    }
    return this.$loopSubsObject( property, value, event, refLevel, level, meta, original )
  }
}
