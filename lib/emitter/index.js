"use strict";

var Base = require('../base')
var proto = Base.prototype
var util = require('../util')
var remove = Base.prototype.remove

var Storage = new Base({
  $define: {
    //more acurate (keys are stored differently for storage to save cpu and mem)
    $removeProperty: function( property, key ) {
      this[key] = null
    }
  }
}).$Constructor

var Emitter = module.exports = new Base({
  $inject: require('../base/uid'),
  $define: {
    $ChildConstructor: Storage,
    $executePostponed: true,
    $exec:function( bind, event, bound ) {
      var emitter = this

      var stamp = event.$stamp

      emitter.$lastStamp = event.$stamp

      if(emitter.$fn) {
        emitter.$fn.each(function(property, key) {
          property.call( bind, event, emitter._$meta )
        }, exclude, stamp )
      }
      
      if( emitter.$base ) {
        emitter.$base.each(function(property) {
          property.$emit('$change', event)
        }, exclude, stamp )
      }
      
      if( emitter.$passon ) {
        emitter.$passon.each(function(property) {
          execPasson( property, bind, event, emitter )
        }, exclude, stamp )
      }

      if(emitter._$meta) {
        emitter._$meta = null
      }

      if( !bound && this.__$bind__ ) {
        for(var i in this.__$bind__) {
          if(this.__$bind__[i] !== bind) {
            this.$exec( this.__$bind__[i], event, true )
          } else {
            console.error('dont exec myself twice! -- why am i here again?', bind.$path)
          }
        }
        this.__$bind__ = null
      }

    },
    $addListener:function( val, key, unique, event ) {

      if(!key) {
        key = generateId( this )
      } 

      if( typeof val === 'function' ) 
      {
        add( this, '$fn', val, key, unique, event )
      } else if( val instanceof Base ) {
        if( !add( this, '$base', val, key, unique || true, event ) ) {
          if(!val.$listensOnBase) {
            val.$setKeyInternal( '$listensOnBase', {}, false )
          }
          var listensOnBase =  val.$listensOnBase
          var id = generateId( listensOnBase )
          // listensOnBase.$setKeyInternal( id )
          console.log('add ref', this._$parent._$parent.$path)
          listensOnBase[id] = this._$parent._$parent

        }
      } else if( val instanceof Array ) {
        if( !add( this, '$passon', val, key, unique, event ) ) {
          if(val[2]) {
            val[2] = val.slice(1)
            val = val.slice(0,2)
          }
          if( val[1] instanceof Base ) {
            if( !val.$listensOnPasson ) {
              val[1].$setKeyInternal( '$listensOnPasson', {}, false )
            }
            var listensOnPasson = val[1].$listensOnPasson
            
            var id = generateId( listensOnPasson )
            // listensOnPasson.$setKeyInternal( id )
            console.log( 'add passon', listensOnPasson[id], this.$path )
            //emitter is fine
            listensOnPasson[id] = this

          }
        }
      }
    },
    $set:function( val, event ) {
      if( util.isPlainObj( val ) && !(val instanceof Array) ) {
        if( val.$define || val === null ) {
          proto.$set.apply( this, arguments )
        } else {
          if( val.$val ) {
            val.val = val.$val
            delete val.$val
          }
          for(var key$ in val) {
            this.$addListener( val[key$], key$, void 0, event )
          }
        }
      } else {
        //uses each so $ and _ fields get ignored (thats why val)
        this.$addListener( val, 'val', void 0, event )
      }
    },
    $postpone: function( bind, event ) {

      if( !event ) {
        throw new Error( '$postpone does not have event! (emitter)' )
        return
      }

      if( !bind.hasOwnProperty('$postPonedStamp') || 
          event.$stamp !== bind.$postPonedStamp[this.$uid]
      ) {
        
        //maybe here is the place ot add hasOwnProperty?
        if( !this.__$bind__ ) {
          this.__$bind__ = []
        } else {
          if(this._$parent && !this.hasOwnProperty('__$bind__')) {
            console.error(
              'I DONT HAVE MY OWN BOUND', 
              this.$path, 'from', Object.getPrototypeOf(this).$path
            )
          }
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
  },
  $flags: {
    $base: new Storage({
      $define: {
        $removeProperty: function( property, key ) {
          var listens = property.$listensOnBase
          for( var i = 0, length = listens.length; listens < length; i++ ) {
            //make this better
            if( listens[i] === this._$parent._$parent._$parent ) {
              console.error('REMOVE FROM LISTENS!')
            }
          }
          this[key] = null
        }
      }
    }),
    $passon: new Storage({
      $define: {
        $removeKey: function( property, key ) {
          if(property[1] instanceof Base) {
            var listens = property[1].$listensOnPasson
            for( var i = 0, length = listens.length; listens < length; i++ ) {
              //make this better
              //emitter is reffed in listens?
              if( listens[i] === this ) {
                //this will also remove inhertied props so thats nice
                console.error('REMOVE FROM LISTENS!')
              }
            }
          }
          this[key] = null
        }
      }
    })
  }
}).$Constructor

//helpers -- maybe make into a seperate module 'shared'?
function exclude( property, key, base, stamp ) {
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
  return ( base.length ? base.length++ : (base.length = 1) )-1
}

function add( emitter, type, val, key, unique, event ) {
   if(!emitter[type]) {
      //this resolves multiple listeners
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

