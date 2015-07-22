"use strict";

var Base = require('../base')
var proto = Base.prototype
var util = require('../util')
var shared = require('./shared')

//faster lookup
var add = shared.add
var generateId = shared.generateId
var execPasson = shared.execPasson
var exclude = shared.exclude

var ListensOn = require('./listens')
var ListensOnPasson = ListensOn.ListensOnPasson
var ListensOnBase = ListensOn.ListensOnBase

var Emitter = module.exports = new Base({
  $inject: [
    require('../base/uid'),
    require('./storage')
  ],  
  $define: {
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

      //find key in all stores
      if( typeof val === 'function' ) 
      {
        add( this, '$fn', val, key, unique, event )
      } else if( val instanceof Base ) {
        if( !add( this, '$base', val, key, unique || true, event ) ) {
          if(!val.$listensOnBase) {
            val.$setKeyInternal( '$listensOnBase', new ListensOnBase(), false )
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
          var passedOnBased = val[1]
          if( passedOnBased instanceof Base ) {
            if( !passedOnBased.$listensOnPasson ) {
              passedOnBased
                .$setKeyInternal( '$listensOnPasson', new ListensOnPasson(), false )
            }
            var listensOnPasson = passedOnBased.$listensOnPasson
            
            var id = generateId( listensOnPasson )
            // listensOnPasson.$setKeyInternal( id )
            // console.log( 'add passon', listensOnPasson[id], id, this.$path )
            //emitter is fine
            listensOnPasson[id] = this

          }
        }
      }
    },
    $set:function( val, event, nocontext ) {
      //this may prove problematic...
      //for now it does not matter since emitters only have nested properies (that you cant touch)
      if( util.isPlainObj( val ) && !(val instanceof Array) ) {
        if( val.$define || val === null ) {
          proto.$set.call( this, event, nocontext )
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
        } else if( !event.$block ) {
          this.$exec( bind, event )
        }
      }
    }
  }
}).$Constructor


