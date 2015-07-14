"use strict";

var Base = require('../../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var util = require('../../../util')

var Emitter = module.exports = new Base({
  $define: {
    $executePostponed: true,
    $generateConstructor: function() {
      return (function Emitter( val, event ) {
        if(event) {
          this.$lastStamp = this.$postPonedStamp = event.$stamp
        }
        //emitter does not use on $new for now so Base is sufficient (faster)
        Base.apply(this, arguments)
      })
    },
    $exec:function( bind, event ) {
      var emitter = this
      emitter.$lastStamp = emitter.$postPonedStamp = event.$stamp

      //seperating them is very nice since it makes execution faster
      if(emitter.$onFn) {
        emitter.$onFn.$each(function(property) {
          property.call( bind, event, emitter._$meta )
        })
      }
      
      if(emitter.$onBase) {
        //this is specific for the $change type so make a seperate change thing perhaps ?
        emitter.$onBase.$each(function(property) {
          property.$emit('$change', event)
        })
      }
      
      if(emitter.$onBound) {
        emitter.$onBound.$each(function(property) {
          if(property[2]) {
            property[0].apply( 
              property[1] || bind, 
              [ event, emitter._$meta ].concat( property[2] ) 
            )
          } else {
            property[0].call( property[1] || bind, event, emitter._$meta )
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
    $addListener:function( val, key ) {

      if(!key) {
        console.warn('no key generate it!')
        key = generateId( this )
      } else {
        console.warn('this is the key!', key)
      }
 
      //optmize this /w keyinternal
      //do we want to search trough all the keys and just use arrays /w ref here? (or something)

      if( typeof val === 'function' ) 
      {
        add( this, '$onFn', val, key )
      } else if( val instanceof Base ) {
        if( !add( this, '$onBase', val, key, true ) ) {
          if(!val.$listensOnBase) {
            val.$setKeyInternal( '$listensOnBase', {}, false )
          }
          var listensOnBase =  val.$listensOnBase
          listensOnBase.$setKeyInternal( generateId( listensOnBase ) )
        }
      } else if( val instanceof Array ) {
        add( this, '$onBound', val, key )
        if(val[2]) {
          val[2] = val.slice(2)
          val = val.slice(0,2)
        }
        if( val[1] instanceof Base ) {
          if(!val.$listensOnBound) {
            val[1].$setKeyInternal( '$listensOnBound', {}, false )
          }
          var listensOnBound =  val[1].$listensOnBound
          listensOnBound.$setKeyInternal( generateId( listensOnBound ) )
        }
      }
      // console.log('add listener', this.$toString())
    },
    $set:function(val, event) {
      //this is a bit strange
      if(util.isPlainObj(val) && !(val instanceof Array)) {
        if(val.$define) {
          proto.$set.apply(this, arguments)
        } else {
          for(var key$ in val) {
            console.error(key$)
            //sharing keys e.g. a key can be function or a method how to solve?

            //how to remove?

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
      if(!event) {
        console.error('$postpone does not have event')
        return
      }

      if( event.$stamp !== this.$postPonedStamp ) {
        this.__$bind__ = this.$bind
        event.$postpone(this)
        this.$postPonedStamp = event.$stamp
      }
    },
    $emitEvent:function( event, force, meta ) {
      if(meta) {
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

function add( base, type, val, key, unique ) {
  
  if(!base[type] ) { 
    base.$setKeyInternal( type, {}, false )
  } else if( unique ) {
    for(var i in base[type]) {
      //!!!propably dont want this for functions!!!
      if(base[type][i]===val) {
        console.error('allready added!', val.$path)
        return true
      }
    }
  }
  // val.$ignoreFire = true
  base[type][key] = val
  // base[type].$setKeyInternal( key, val, false )
}