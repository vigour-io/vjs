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
    require('./execute')
  ],
  $flags: {
    $pattern: function( val, event ) {
      //handle changing pattern (bit strange to do -- since key should change as well then)
      this._$pattern = val
      if(this._$parent) {
        var observable = this._$parent._$parent
        this.$loopSubsObject( observable, val, event, 1, 1, false, true )
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
          this.$pattern( this._$pattern, event )
        }

      })
    }
  }
}).$Constructor
