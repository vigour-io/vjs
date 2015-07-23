"use strict"

var Base = require('../../base')
var Emitter = require('../../emitter') 
var util = require('../../util')

exports.$define = {
 removeListener: function( type, val, event ) {
    if( typeof type === 'string' ) {

      if( !val ) {
        val = 'val'
      }

      if( !this.$on || !this.$on[type] ) {
        throw new Error('no $on or no ', type, 'emitter')
      }

      var emitter = this.$on[type]
      var context = emitter._$context
      var storageKey 

      if( typeof val === 'string' ) {
        storageKey = findKey( val, emitter )
        emitter = resolveContext( this, type, emitter, context, storageKey )
        emitter[storageKey]
          .$removeProperty( emitter[storageKey][val], val )

      } else {
        console.log('removeListener on something else find it!')
        findAndRemove( this, val, emitter )
      }
    } else {
      //same for on moves one the the left
      //dit word nog wel wat lastiger..
      findAndRemove( this, type )
    }
  }
}

function findAndRemove( base, val, emitter ) {
  if( !emitter ) {
    for( var key$ in base.$on ) {
      if( base.$on[key$] instanceof Emitter ) {
        findAndRemove( base, val, base.$on[key$] )
      }
    }
  } else {
    if( util.isPlainObj(val) ) {
      console.log('using options!')
    }

    if( typeof val === 'function' ) {

      if( emitter.$fn ) {
        for( var key$ in emitter.$fn ) {
          if( emitter.$fn && emitter.$fn[key$] === val ) {
            base.removeListener( emitter._$key, key$ )
          }
        }
      }

      if( emitter.$passon ) {
        for( var key$ in emitter.$passon ) {
          if( emitter.$passon && 
              emitter.$passon[key$] && 
              emitter.$passon[key$][0] === val 
          ) {
            base.removeListener( emitter._$key, key$ )
          }
        }
      }

    } else if ( val instanceof Base ) {

      if( emitter.$base ) {
        for( var key$ in emitter.$base ) {
          if( emitter.$base && emitter.$base[key$] === val ) {
            base.removeListener( emitter._$key, key$ )
          }
        }
      }

      if( emitter.$passon ) {
        for( var key$ in emitter.$passon ) {
          if( emitter.$passon && 
              emitter.$passon[key$] && 
              emitter.$passon[key$][1] === val 
          ) {
            base.removeListener( emitter._$key, key$ )
          }
        }
      }

    } else {
      console.log('do not support', val , 'type in find and remove listener')
    }
  }
}

function findKey( key, emitter ) {
  var storageKey 
  if( emitter.$fn && emitter.$fn[key] ) {
    storageKey = '$fn'
  } else if( emitter.$base && emitter.$base[key] ) {
    storageKey = '$base'
  } else if( emitter.$passon && emitter.$passon[key] ) {
    storageKey = '$passon'
  }
  return storageKey
}

function resolveContext( base, type, emitter, context, storageKey ) {
  if( context ) {
    var setObj = {$on:{}}
    setObj.$on[type] = {}
    base.$set( setObj )
    emitter = base.$on[type]
  }
  if(!emitter.hasOwnProperty( storageKey) ) {
    emitter.$setKey( storageKey, {}, false )
  }
  return emitter
}