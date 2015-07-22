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

exports.execPasson = function( property, bind, event, emitter ) {
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
  return ( base._$id ? (++base._$id) : (base._$id = 1) )
}

exports.add = function( emitter, type, val, key, unique, event ) {
   if( !emitter[type] ) {
      emitter.$setKey( type, {}, false )
   } else if( unique && emitter[type] ) {
    var isFn = typeof unique === 'function'
    if(isFn) {
       for(var i in emitter[type]) {
        if( unique.call( emitter, emitter[type][i], val) ) {
          return true
        }
      }
    } else {
      for( var i in emitter[type] ) {
        if( emitter[type][i] === val ) {
          return true
        }
      }
    }
  }  

  if( !emitter.hasOwnProperty(type) ) {
    emitter.$setKey( type, {}, false )
  }

  if(event) {
    val._$ignoreStamp = event.$stamp
  }

  emitter[type][key] = val 
}
