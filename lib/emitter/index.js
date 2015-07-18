"use strict";

var Base = require('../base')
var proto = Base.prototype
var util = require('../util')

var Emitter = module.exports = new Base({
  $inject: require('../base/uid'),
  $define: {
    $ChildConstructor: Base,
    $executePostponed: true,
    $exec:function( bind, event, bound ) {
      var emitter = this

      var stamp = emitter.$lastStamp = event.$stamp

      // console.error('EXEC', bind.$path, emitter._$parent._$parent.$path)

      if(emitter.$onFn) {
        emitter.$onFn.each(function(property, key) {
          property.call( bind, event, emitter._$meta )
        }, exclude, stamp )
      }
      
      if( emitter.$onBase ) {
        emitter.$onBase.each(function(property) {
          // console.log('emit base (real) from:', emitter._$parent._$parent.$path, 'to:', property.$path)
          property.$emit('$change', event)
          //no instances nessecary ??? lets find out...
        }, exclude, stamp )
      }
      
      if( emitter.$onPasson ) {
        emitter.$onPasson.each(function(property) {
          execPasson( property, bind, event, emitter )
        }, exclude, stamp )
      }

      if(emitter._$meta) {
        emitter._$meta = null
      }

      if( !bound && this.__$bind__ ) {
        for(var i in this.__$bind__) {
          if(this.__$bind__[i] !== bind) {
            // console.error('exec bound')
            this.$exec( this.__$bind__[i], event, true )
          } else {
            console.error('dont exec myself twice!')
          }
        }
        this.__$bind__ = null
      }

      // if(this.__$bind__ ) {
       
      // }

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
        this.$addListener( val, 'val', void 0, event )
      }
    },
    // $bind:{
    //   get:function( val, event ) {
    //     //double check (instances again)
    //     return this.__bind__ || this.$parent.$parent
    //   }
    // },
    $postpone: function( bind, event ) {

      if( !event ) {
        throw new Error( '$postpone does not have event! (emitter)' )
        return
      }

      // console.info('BIND IT!', bind.$path, bind.$postPonedStamp)

      if( 
        !bind.hasOwnProperty('$postPonedStamp') || 
        (event.$stamp !== bind.$postPonedStamp[this.$uid]) 
      ) {
        // console.info('BIND IT PASS!!', bind.$path, bind.$postPonedStamp)
        
        if( !this.__$bind__ ) {
          this.__$bind__ = []
        }

        if( this._$parent._$parent !== bind ) {
          this.__$bind__.push( bind )
        }

        if( 
          !this.hasOwnProperty( '$myPostPonedStamp' ) || 
          this.$myPostPonedStamp !== event.$stamp 
        ) {
          event.$postpone( this )
        }

        if( !bind.hasOwnProperty( '$postPonedStamp' ) ) {
          bind.$postPonedStamp = {} 
        } 

        bind.$postPonedStamp[this.$uid] = this.$myPostPonedStamp = event.$stamp
      }
    },
    $emit:function( event, bind, force, meta ) {
      if( meta ) {
        this._$meta = meta
      }
      if( this.$lastStamp !== event.$stamp ) {
        if( event.$origin !== bind && !force ) {
          this.$postpone( bind, event )
        } else {
          this.$exec( bind, event )
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

function execPasson( property, bind, event, emitter ) {
  if( property[2] ) {
      property[0].apply( 
      bind, 
      [ event, emitter._$meta ].concat( property[2] ) 
    )
  } else {
    property[0].call( bind, event, emitter._$meta, property[1] )
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

  console.warn(event,'???')

  if(event) {
    val._$ignoreStamp = event.$stamp
  }

  emitter[type][key] = val 
}

