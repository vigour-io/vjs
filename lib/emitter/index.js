"use strict";

var Base = require('../base')
var proto = Base.prototype
var util = require('../util')
var remove = Base.prototype.remove
var shared = require('./shared')

//faster lookup
var add = shared.add
var generateId = shared.generateId
var execPasson = shared.execPasson
var exclude = shared.exclude
var removeFromListens = shared.removeFromListens

var ListensStore = new Base({
  $define: {
    $createContextGetter: function(){}
  },
  $useVal:true
}).$Constructor

var Storage = new Base({
  $define: {
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
            val.$setKeyInternal( '$listensOnBase', new ListensStore(), false )
          }
          var listensOnBase =  val.$listensOnBase
          var id = generateId( listensOnBase )
          listensOnBase[id] = this

        }
      } else if( val instanceof Array ) {
        if( !add( this, '$passon', val, key, unique, event ) ) {
          if(val[2]) {
            val[2] = val.slice(1)
            val = val.slice(0,2)
          }
          if( val[1] instanceof Base ) {
            if( !val.$listensOnPasson ) {
              val[1].$setKeyInternal( '$listensOnPasson', new ListensStore(), false )
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
          if( property instanceof Base ) {
            var emitter = this._$parent
            removeFromListens( property.$listensOnBase, emitter )
          }
          this[key] = null
        }
      }
    }),
    $passon: new Storage({
      $define: {
        $removeKey: function( property, key ) {
          if( property[1] instanceof Base ) {
            var emitter = this._$parent
            removeFromListens( property[1].$listensOnPasson, emitter )
          }
          this[key] = null
        }
      }
    })
  }
}).$Constructor


