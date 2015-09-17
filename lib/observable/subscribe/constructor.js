"use strict";
var Emitter = require( '../../emitter' )

var Base = require('../../base')

module.exports = new Emitter( {
  $meta: true,
  $inject: [
    require('./loop'),
    require('./change'),
    require('./property'),
    require('./upward'),
    require('./path'),
  ],
  $flags: {
    $pattern: function( val, event ) {
      console.log('%cpattern --->','color:white;background:#333;', val)
      //handle changing pattern (bit strange to do -- since key should change as well then)
      this._$pattern = val
      if(this._$parent) {
        var observable = this._$parent._$parent
        this.$loopSubsObject( observable, val, event, 1, 1 )
      } else {
        console.warn('no parent yet --- need a way to know if this is added to a parent!')
        //when added do something!
      }
    }
  },
  $define: {
    $generateConstructor: function() {
      return (function derivedBase( val, event, parent, key ) {
        Base.apply( this, arguments )
        this.$clearContext() //is this nessecary??
        if(this._$pattern && this._$parent) {
          console.log('new and go loop! be strong!')
          this.$loopSubsObject( this._$parent._$parent, this._$pattern, event, 1, 1 )
        }
      })
    }
  }
}).$Constructor
