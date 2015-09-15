"use strict";

exports.encoded = function( refLevel, level ) {
  return( refLevel << 8 ) | level
}

exports.decodedRefLevel = function( nr ) {
  return( nr >> 8 ) & 0xff
}

exports.decodedLevel = function( nr ) {
  return nr & 0xff
}

exports.keepListener = function( val, args ) {
  var myRefLevel = args[ 1 ]
  var myLevel = args[ 2 ]
  for( var i in val ) {
    var v = val[ i ]
    if( ( v === true
        || exports.decodedRefLevel( v ) > myRefLevel
        || exports.decodedLevel( v ) > myLevel
      ) &&
      i !== '$parent' && i !== '$val'
    ) {
      return true
    }
  }
}
