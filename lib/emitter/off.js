var util = require( '../util' )
var Base = require( '../base' )

//can become faster
exports.$define = {
  off: function( val ) {
    var emitter = this
    var context = emitter._$context
    var storageKey
    var storage
    if( typeof val === 'string' || typeof val === 'number' ) {
      storageKey = findKey( val, emitter )
      emitter = resolveContext( emitter, context, storageKey )
      storage = emitter[storageKey]
      storage.$removeProperty( storage[val], val )
    } else {
      findAndRemove( emitter, val )
    }
  }
}

function resolveContext( emitter, context, storageKey ) {
  //TODO: clean up - try to use internal context resolve more on no
  //figure out why we cant use $resolveContextSet since thats what it is
  if( context ) {
    //this is lame stuff! should be in observable in some way...
    var base = emitter.$parent.$parent
    var type = emitter.$key
    var setObj = {$on:{}}
    setObj.$on[type] = {}
    base = base.set( setObj )  //.$on[type]
    emitter = base.$on[type]
  }
  if(!emitter.hasOwnProperty( storageKey) ) {
    emitter.setKey( storageKey, {}, false )
  }
  return emitter
}

function removeFromStorage( storage, val, emitter, field ) {
  if( storage ) {
    var check = val.$check
    if( check ) {
      storage.each(function( compare, key ) {
        if( check( compare ) ) {
          emitter.off( key )
        }
      })
    } else if( field !== void 0 ) {
      storage.each(function( compare, key ) {
        if( compare[field] === val ) {
          emitter.off( key )
        }
      })
    } else {
      storage.each(function( compare, key ) {
        if( compare === val ) {
          emitter.off( key )
        }
      })
    }
  }
}

function findKey( key, emitter ) {
  var storageKey
  if( emitter.$fn && emitter.$fn[key] ) {
    storageKey = '$fn'
  } else if( emitter.$base && emitter.$base[key] ) {
    storageKey = '$base'
  } else if( emitter.$attach && emitter.$attach[key] ) {
    storageKey = '$attach'
  }
  return storageKey
}

function findAndRemove( emitter, val ) {
  if( util.isPlainObj(val) ) {
    if( val.$fn ) {
      removeFromStorage( emitter.$fn, val.$fn, emitter )
    }
    if( val.$attach ) {
      removeFromStorage(
        emitter.$attach,
        val.$attach,
        emitter,
        typeof val.$attach === 'function' ? 0 : 1
      )
    }
    if( val.$base ) {
      removeFromStorage( emitter.$base, val.$base, emitter )
    }
  } else if( typeof val === 'function' ) {
    removeFromStorage( emitter.$fn, val, emitter )
    removeFromStorage( emitter.$attach, val, emitter, 0 )
  } else if ( val instanceof Base ) {
    removeFromStorage( emitter.$base, val, emitter )
    removeFromStorage( emitter.$attach, val, emitter, 1 )
  } else {
    console.warn('do not support', val , 'type in find and remove listener')
  }
}
