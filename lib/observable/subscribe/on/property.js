"use strict";
var encoded = require('../shared').encoded
module.exports = function onProperty( event, meta, subsemitter, refLevel, level, val, any, original ) {

  console.log('%conProperty fires','color:white;background:#333;', this._$path)

  if( meta ) {
    var added = meta.added
    if( added ) {
      for( var i = added.length - 1; i >= 0; i-- ) {
        var key = added[ i ]
        if( any ) {
          val[ key ] = encoded( refLevel )
        }
        var value = val[ key ]
        if( value !== void 0 ) {
          subsemitter.$subscribeToProperty( this[ key ], val, key, event, refLevel, level, meta, original )
        }
      }
    }
  }
}
