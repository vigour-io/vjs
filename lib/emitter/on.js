"use strict";

var Base = require( '../base' )
var set = Base.prototype.set
var util = require( '../util' )
var isLikeNumber = util.isLikeNumber
var shared = require( './shared' )
//faster lookup
var add = shared.add
var generateId = shared.generateId

var ListensOn = require( './listens' )
var ListensOnattach = ListensOn.ListensOnattach
var ListensOnBase = ListensOn.ListensOnBase

exports.$define = {
  on: function( val, key, unique, event ) {
    // console.log('hello?', val, key)
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
        set.call( this, val, event, nocontext )
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
            this.on( val[key$], key$, void 0, event )
          }
        }
      }
    } else {
      // uses each so $ and _ fields get ignored (thats why val)
      this.on( val, 'val', void 0, event )
    }
    return this
  }
}
