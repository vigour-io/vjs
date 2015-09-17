"use strict";
module.exports = function onReference( event, meta, subsemitter, refLevel, level, val, original ) {
  //remove the old ref listeners
  subsemitter.$listensOnAttach.each( function( property ) {
      property.$attach.each( function( prop, key ) {
        if( prop[ 2 ][ 1 ] >= refLevel ) {
          property.$attach.$removeProperty( prop, key )
        }
      } )
    } )
    //add the new ref listeners
  var referenced = this._$input
  if( referenced ) {
    subsemitter.$loopSubsObject( referenced, val, event, refLevel, level, meta, original )
  }
}
