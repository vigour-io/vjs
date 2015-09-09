"use strict";

var Base = require( '../base' )

module.exports = new Base({
  $ChildConstructor: '$Constructor',
  $inject: [
    require( './on' ),
    require( './emit' ),
    require( './off' ),
    require( './subscribe' ),
    require( './stamp' ),
    require( './remove' ),
    require( './set' ),
    require( './constructor' ),
    require( './subscribe' )
  ]
}).$Constructor
