"use strict";
var Emitter = require( '../../emitter' )

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
      var observable = this._$parent._$parent
      this._$pattern = val
      this.$loopSubsObject( observable, val, event, 1, 1 )
    }
  }
}).$Constructor
