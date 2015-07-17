"use strict";

var Base = require('../base')
var proto = Base.prototype
var util = require('../util')

var Emitter = module.exports = new Base({
  $define: {
    $ChildConstructor: Base,
    $executePostponed: true,
    $exec:function( bind, event ) {
      var emitter = this
      var stamp = emitter.$lastStamp = emitter.$postPonedStamp = event.$stamp

      if(emitter.$onFn) {
        emitter.$onFn.each(function(property, key) {
          property.call( bind, event, emitter._$meta )
        }, exclude, stamp )
      }
      
      if( emitter.$onBase ) {
        emitter.$onBase.each(function(property) {
          property.$emit('$change', event)
        }, exclude, stamp )
      }
      
      if( emitter.$onPasson ) {
        emitter.$onPasson.each(function(property) {
          if( property[2] ) {
            property[0].apply( 
              bind, 
              [ event, emitter._$meta ].concat( property[2] ) 
            )
          } else {
            property[0].call( bind, event, emitter._$meta, property[1] )
          }
        }, exclude, stamp )
      }

      if(emitter._$meta) {
        emitter._$meta = null
      }

      if(this.__$bind__ ) {
        this.__$bind__ = null
      }

    },
    $addListener:function( val, key, unique, event ) {

      if(!key) {
        key = generateId( this )
      } 

      if( typeof val === 'function' ) 
      {
        add( this, '$onFn', val, key, unique, event )
      } else if( val instanceof Base ) {
        if( !add( this, '$onBase', val, key, unique || true, event ) ) {
          if(!val.$listensOnBase) {
            val.$setKeyInternal( '$listensOnBase', {}, false )
          }
          var listensOnBase =  val.$listensOnBase
          listensOnBase.$setKeyInternal( generateId( listensOnBase ) )
        }
      } else if( val instanceof Array ) {
        if( !add( this, '$onPasson', val, key, unique, event ) ) {
          if(val[2]) {
            val[2] = val.slice(1)
            val = val.slice(0,2)
          }
          if( val[1] instanceof Base ) {
            if( !val.$listensOnPasson ) {
              val[1].$setKeyInternal( '$listensOnPasson', {}, false )
            }
            var listensOnPasson =  val[1].$listensOnPasson
            listensOnPasson.$setKeyInternal( generateId( listensOnPasson ) )
          }
        }
      }
    },
    $set:function( val, event ) {
      if( util.isPlainObj( val ) && !(val instanceof Array) ) {
        if( val.$define ) {
          proto.$set.apply( this, arguments )
        } else {
          for(var key$ in val) {
            this.$addListener( val[key$], key$, void 0, event )
          }
        }
      } else {
        //uses each so $ amd _ fields get ignored (thats why val)
        this.$addListener( val, 'val' )
      }
    },
    $bind:{
      get:function( val, event ) {
        //double check (instances again)
        return this.__bind__ || this.$parent.$parent
      }
    },
    $postpone: function( event ) {
      if( !event ) {
        throw new Error( '$postpone does not have event! (emitter)' )
        return
      }

      if( event.$stamp !== this.$postPonedStamp ) {
        this.__$bind__ = this.$bind
        event.$postpone( this )
        this.$postPonedStamp = event.$stamp
      }
    },
    $emit:function( event, force, meta ) {
      if( meta ) {
        this._$meta = meta
      }
      if( this.$lastStamp !== event.$stamp ) {
        if( event.$origin !== this.$bind && !force ) {
          this.$postpone( event )
        } else {
          this.$exec( this.$bind, event )
        }
      }
    }
  }
}).$Constructor

//helpers -- maybe make into a seperate module 'shared'?
function exclude( property, key, base, stamp ) {
  var ignore = property._$ignoreStamp
  if( ignore ) {
    property._$ignoreStamp = null
    if( ignore === stamp ) {
      return true
    }
  }
}

function generateId( base ) {
  return base._$id ? base._$id++ : (base._$id = 1)
}

function add( emitter, type, val, key, unique, event ) {
   if(!emitter[type]) {
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

  if( emitter[type]._$parent !== emitter ) {
    emitter.$setKey( type, {}, false )
  }

  if(event) {
    val._$ignoreStamp = event.$stamp
  }

  emitter[type][key] = val 
}

