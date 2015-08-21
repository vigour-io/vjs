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

exports.exclude = function( property, key, base, stamp ) {
  var ignore = property._$ignoreStamp
  if( ignore ) {
    if( ignore === stamp ) {
      return true
    } else {
      //remove in the second
      property._$ignoreStamp = null
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

exports.add = function( emitter, type, val, key, unique, event ) {
  var emitterType = emitter[type]
  if( !emitterType ) {
    emitter.setKey( type, {}, false )
  } else if( unique ) {
    var isFn = typeof unique === 'function'
    var stop
    if(isFn) {
      emitterType.each(function(listener, kur){
        // console.log('kur', kur, listener)
        if( !unique.call( emitter, listener, val) ) {
          return stop = true
        }
      })
    } else {
      emitterType.each(function(listener){
        if( listener === val ) {
          return stop = true
        }
      })
    }
    if(stop) {
      return true
    }
  }

  if( !emitter.hasOwnProperty(type) ) {
    emitter.setKey( type, {}, false )
  }

  if(event) {
    val._$ignoreStamp = event.$stamp
  }

  //also chech for remove

  if(emitter[type][key]) {
    emitter[type].$removeProperty( emitter[type][key], key, true )
  }

  removeKeyFromOtherStores( key, type, emitter )
  emitter[type][key] = val
  
}

function removeKeyFromOtherStores( key, type, emitter ) {
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
