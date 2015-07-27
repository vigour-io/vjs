"use strict";

var Base = require( '../base' )
var proto = Base.prototype
var util = require( '../util' )
var shared = require( './shared' )

//faster lookup
var add = shared.add
var generateId = shared.generateId
var execPasson = shared.execPasson
var exclude = shared.exclude

var ListensOn = require( './listens' )
var ListensOnPasson = ListensOn.ListensOnPasson
var ListensOnBase = ListensOn.ListensOnBase

var Emitter = module.exports = new Base({
  $inject: [
    require( '../base/uid' ),
    require( './storage' )
  ],  
  $define: {
    $executePostponed: true,
    $execInternal: function( bind, event ) {
      var emitter = this
      var stamp = event.$stamp

      emitter.$lastStamp = event.$stamp

      if( emitter.$fn ) {
        emitter.$fn.each( function( property, key ) {
          property.call( bind, event, emitter._$meta )
        }, exclude, stamp )
      }
      
      if( emitter.$base ) {
        emitter.$base.each( function( property ) {
          property.$emit( '$change', event )
        }, exclude, stamp )
      }
      
      if( emitter.$passon ) {
        emitter.$passon.each( function( property ) {
          execPasson( property, bind, event, emitter )
        }, exclude, stamp )
      }

      bind.$emitterStamps = null

    },
    $exec:function( bind, event ) {

      if(!this._$parent) {
        //this.__$bind__ allready gaurds
        console.warn('emitter - no parent, i am probably removed!')
      }

      if(  this.__$bind__ ) {
        //if not then nothing is executing
        for( var i in this.__$bind__ ) {
          this.$execInternal( this.__$bind__[i], event )
        }
        this.__$bind__ = null
      }

      if(this._$meta) {
        this._$meta = null
      }

      this.$isPostponed = null

    },
    $addListener: function( val, key, unique, event ) {

      if( !key ) {
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
    $set: function( val, event, nocontext ) {

      //this may prove problematic...
      //for now it does not matter since emitters only have nested properies (that you cant touch)
      if( util.isPlainObj( val ) && !(val instanceof Array) ) {
        if( val.$define || val === null ) {
          proto.$set.call( this, val, event, nocontext )
        } else {
          if( val.$val ) {
            val.val = val.$val
            delete val.$val
          }
          for( var key$ in val ) {
            this.$addListener( val[key$], key$, void 0, event )
          }
        }
      } else {
        //uses each so $ and _ fields get ignored (thats why val)
        this.$addListener( val, 'val', void 0, event )
      }
    },
    $pushBind: function( bind, event ) {
      if( 
        !bind.hasOwnProperty( '$emitterStamps' ) || 
        !bind.$emitterStamps ||
        event.$stamp !== bind.$emitterStamps[this.$uid]
      ) {

        if( !this.__$bind__ || !this.hasOwnProperty( '__$bind__') ) {
          this.__$bind__ = []
        } 
        this.__$bind__.push( bind )

        if( 
          !bind.hasOwnProperty( '$emitterStamps' ) || 
          !bind.$emitterStamps 
        ) {
          bind.$emitterStamps = {} 
        } 

        bind.$emitterStamps[this.$uid] = event.$stamp

        return true

      }
      return false
    },
    $postpone: function( bind, event ) {

      if( !event ) {
        throw new Error( '$postpone does not have event! (emitter)' )
        return
      }

      if( 
        this.$pushBind( bind, event )
      ) {        
        if( 
          //instances zijn special ofcourse
          !this.hasOwnProperty( '$isPostponed' ) || 
          !this.$isPostponed
        ) {
          event.$postpone( this )
          this.$isPostponed = true
        }
      }

    },
    $emit:function( event, bind, force, meta ) {
      if( meta ) {
        this._$meta = meta
      }

      // console.error('xxxxx wtf is going on', 
      //   this.$lastStamp, 
      //   event.$stamp
      // )

      if( this.$lastStamp !== event.$stamp ) {
        if( event.$origin !== bind && !force ) {
          this.$postpone( bind, event )
        } else if( !event.$block ) {
          if( bind ) {
            this.$pushBind( bind, event )
          }
          this.$exec( bind, event )
        }
      }
    }
  }
}).$Constructor