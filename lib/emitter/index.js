"use strict";

var Base = require('../base')
var proto = Base.prototype
var util = require('../util')

var Storage = new Base({
  $inject: require('../methods/each')
}).$Constructor

var Emitter = module.exports = new Base({
  $define: {
    $ChildConstructor: Storage,
    $executePostponed: true,
    $generateConstructor: function() {
      return (function Emitter( val, event ) {
        if(event) {
          this.$lastStamp = this.$postPonedStamp = event.$stamp
        }
        Base.apply(this, arguments)
      })
    },
    $exec:function( bind, event ) {
      var emitter = this
      emitter.$lastStamp = emitter.$postPonedStamp = event.$stamp

      //seperating them is very nice since it makes execution faster
      if(emitter.$onFn) {
        // console.error(emitter.$onFn)

        emitter.$onFn.each(function(property, key) {
          property.call( bind, event, emitter._$meta )

          //bind kan weg

          // if(instances) {
          //   // console.error('got instances!')
          //   for( var i = 0, l = instances.length; i<l;i++ ) {
          //     var instance = instances[i]
          //     // console.error(emitter._$key, emitter.$path)
          //     if(bind !== instance && instance.$on[emitter._$key].$onFn[key]===property) {
          //       property.call( instance, event, emitter._$meta )
          //     }
          //   }
          // }

        })
      }
      
      if(emitter.$onBase) {
        //this is specific for the $change type so make a seperate change thing perhaps ?
        emitter.$onBase.each(function(property) {
          // console.error('on base lezzgo')
          property.$emit('$change', event)
        })
      }
      
      if(emitter.$onPasson) {
        emitter.$onPasson.each(function(property) {
          if(property[2]) {
            property[0].apply( 
              bind, 
              [ event, emitter._$meta ].concat( property[2] ) 
            )
          } else {
            property[0].call( bind, event, emitter._$meta, property[1] )
          }
        })
      }

      if(emitter._$meta) {
        emitter._$meta = null
      }

      //make this into ._$bind ?
      if(this.__$bind__ ) {
        this.__$bind__ = null
      }

    },
    $addListener:function( val, key, unique ) {

      if(!key) {
        key = generateId( this )
      } 

      if( typeof val === 'function' ) 
      {
        add( this, '$onFn', val, key, unique )
      } else if( val instanceof Base ) {
        if( !add( this, '$onBase', val, key, unique || true ) ) {
          if(!val.$listensOnBase) {
            val.$setKeyInternal( '$listensOnBase', {}, false )
          }
          var listensOnBase =  val.$listensOnBase
          listensOnBase.$setKeyInternal( generateId( listensOnBase ) )
        }
      } else if( val instanceof Array ) {
        if( !add( this, '$onPasson', val, key, unique ) ) {
          if(val[2]) {
            val[2] = val.slice(1)
            val = val.slice(0,2)
          }
          if( val[1] instanceof Base ) {
            if(!val.$listensOnPasson) {
              val[1].$setKeyInternal( '$listensOnPasson', {}, false )
            }
            var listensOnPasson =  val[1].$listensOnPasson
            listensOnPasson.$setKeyInternal( generateId( listensOnPasson ) )
          }
        }
      }
    },
    $set:function(val, event) {
      //this is a bit strange
      if(util.isPlainObj(val) && !(val instanceof Array)) {
        if(val.$define) {
          proto.$set.apply(this, arguments)
        } else {
          for(var key$ in val) {
            this.$addListener(val[key$], key$)
          }
        }
      } else {
        this.$addListener(val, 'val')
      }
      //!!!on construction ook shit doen voor inheritance!!!
      //redo this mofo!
    },
    $bind:{
      get:function(val, event) {
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
    //isnt this the emit of emitter?
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

function generateId( base ) {
  //think about instances
  return base._$id ? base._$id++ : (base._$id = 1)
}

function add( emitter, type, val, key, unique ) {
  //base is usualy an emitter
  //maybe just use setkey?

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

  //!!!optimize this!!!
  if( emitter[type]._$parent !== emitter ) {
    //maak special type voor deze storage (geen event etc)
    emitter.$setKey( type, {}, false )
  }

  // val.$ignoreFire = true
  emitter[type][key] = val
  
  // val.$useVal = true
  // base[type].$setKeyInternal( key, val, false )
}

//on parent // on parent instance moet er komen