"use strict";

var Base = require( '../base' )
var proto = Base.prototype
var util = require( '../util' )

var isLikeNumber = util.isLikeNumber

var shared = require( './shared' )

//faster lookup
var add = shared.add
var generateId = shared.generateId
var execattach = shared.execattach
var exclude = shared.exclude

var ListensOn = require( './listens' )
var ListensOnattach = ListensOn.ListensOnattach
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
          // console.log('heeee purk', key, emitter._$meta)
          property.call( bind, event, emitter._$meta )
        }, exclude, stamp )
      }

      if( emitter.$base ) {
        var type = emitter._$key
        emitter.$base.each( function( property ) {
          property.$emit( type, event )
        }, exclude, stamp )
      }

      if( emitter.$attach ) {
        emitter.$attach.each( function( property ) {
          execattach( property, bind, event, emitter )
        }, exclude, stamp )
      }

      // bind.$emitterStamps = null

    },
    $exec:function( bind, event ) {
      if(!this._$parent) {
        //this.__$bind__ allready gaurds
        console.warn('emitter - no parent, i am probably removed!')
        return
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
        if( !add( this, '$attach', val, key, unique, event ) ) {
          if(val[2]) {
            val[2] = val.slice(1)
            val = val.slice(0,2)
          }
          var passedOnBased = val[1]
          if( passedOnBased instanceof Base ) {
            if( !passedOnBased.$listensOnattach ) {
              passedOnBased
                .$setKeyInternal( '$listensOnattach', new ListensOnattach(), false )
            }
            var listensOnattach = passedOnBased.$listensOnattach

            var id = generateId( listensOnattach )
            // listensOnattach.$setKeyInternal( id )
            // console.log( 'add attach', listensOnattach[id], id, this.$path )
            //emitter is fine
            listensOnattach[id] = this
          }
        }
      }
    },
    set: function( val, event, nocontext ) {
      //this may prove problematic...
      //for now it does not matter since emitters only have nested properies (that you cant touch)
      if( util.isPlainObj( val ) && !(val instanceof Array) ) {
        if( val.$define || val === null ) {
          proto.set.call( this, val, event, nocontext )
        } else {
          if( val.$val ) {
            val.val = val.$val
            delete val.$val
          }
          for( var key$ in val ) {
            var flag = this.$flags && this.$flags[key$]
            if( flag ) {
              flag.call( this, val[key$], event, nocontext )
            } else {
             if( isLikeNumber( key$ ) ) {
                if( !this._$id ) {
                  this._$id = Number( key$ )
                }
              }
              this.$addListener( val[key$], key$, void 0, event )
            }
          }
        }
      } else {
        //uses each so $ and _ fields get ignored (thats why val)
        this.$addListener( val, 'val', void 0, event )
      }
      return this
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

      if( this.$lastStamp !== event.$stamp ) {
        if( !force && ( event.$type !== this._$key || event.$origin !== bind ) ) {
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
