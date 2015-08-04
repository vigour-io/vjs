"use strict"

var Base = require('../base')
var Emitter = require('../emitter')
var util = require('../util')

exports.$define = {
 off: function( type, val, event ) {
    if( typeof type === 'string' ) {
      if( !val ) {
        val = 'val'
      }
      if( !this.$on || !this.$on[type] ) {
        console.warn('no $on or no ', type, 'emitter -- from off')
      } else {
        //replace block with function do perf tests
        var emitter = this.$on[type]
        var context = emitter._$context
        var storageKey
        var storage
        if( typeof val === 'string' || typeof val === 'number' ) {
          storageKey = findKey( val, emitter )
          emitter = resolveContext( this, type, emitter, context, storageKey )
          storage = emitter[storageKey]
          storage.$removeProperty( storage[val], val )
        } else {
          findAndRemove( this, val, emitter )
        }
      }
    } else {
      findAndRemove( this, type, void 0, val )
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

function resolveContext( base, type, emitter, context, storageKey ) {
  //TODO: clean up - try to use internal context resolve more on no
  //figure out why we cant use $resolveContextSet since thats what it is
  if( context ) {
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

function findAndRemove( base, val, emitter, key ) {
  if( !emitter ) {
    //TODO clean this up
    if( key ){
      for( var key$ in base.$on ) {
        if( base.$on[key$] instanceof Emitter ) {
          base.off( key$, key )
        }
      }
    }else{
      for( var key$ in base.$on ) {
        if( base.$on[key$] instanceof Emitter ) {
          findAndRemove( base, val, base.$on[key$], key )
        }
      }
    }

  } else {
    if( util.isPlainObj(val) ) {
      //val is een object
      // $key:
      if( val.$fn ) {
        removeFromStorage( base, emitter.$fn, val.$fn, emitter )
      }
      if( val.$attach ) {
        removeFromStorage(
          base,
          emitter.$attach,
          val.$attach,
          emitter,
          typeof val.$attach === 'function' ? 0 : 1
        )
      }
      if( val.$base ) {
        removeFromStorage( base, emitter.$base, val.$base, emitter )
      }
    } else if( typeof val === 'function' ) {
      removeFromStorage( base, emitter.$fn, val, emitter )
      removeFromStorage( base, emitter.$attach, val, emitter, 0 )
    } else if ( val instanceof Base ) {
      removeFromStorage( base, emitter.$base, val, emitter )
      removeFromStorage( base, emitter.$attach, val, emitter, 1 )
    } else {
      console.warn('do not support', val , 'type in find and remove listener')
    }
  }
}

function removeFromStorage( base, storage, val, emitter, field ) {
  if( storage ) {
    if( field !== void 0 ) {
      for( var key$ in storage ) {
        if( storage[key$] && storage[key$][field] === val ) {
          base.off( emitter._$key, key$ )
        }
      }
    } else {
      for( var key$ in storage ) {
        if( storage[key$] === val ) {
          base.off( emitter._$key, key$ )
        }
      }
    }
  }
}
