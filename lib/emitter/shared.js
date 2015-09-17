"use strict";
exports.removeFromListens = function ( listens, emitter ) {
  if(listens) {
    for( var i in listens ) {
      if( i[0] !== '_' ) {
        if( listens[i] === emitter ) {
          delete listens[i]
        }
      }
    }
  }
}

exports.execattach = function( property, bind, event, emitter ) {

  if( property[2] ) {
      property[0].apply(
      bind,
      [ event, emitter._$meta ].concat( property[2] )
    )
  } else {
    property[0].call( bind, event, emitter._$meta, property[1] )
  }
}

exports.generateId = function( base ) {
  var val = ( base._$id ? (++base._$id) : (base._$id = 1) )
  return val
}

exports.removeKeyFromOtherStores = function( key, type, emitter ) {

  //clean this up later
  var types = {
    $fn:true,
    $base:true,
    $attach:true
  }
  for( var type$ in types ) {
    if( type$ !== type ) {
      if( emitter[ type$] && emitter[type$][key] ) {
        emitter[type$].$removeProperty( emitter[type$][key], key )
      }
    }
  }
}
