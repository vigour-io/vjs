"use strict";

module.exports = exports = function Base( val, parent ) {
  this._$parent = parent
  this.$set( val )
}

var proto = exports.prototype
var define = Object.defineProperty

define( proto, '$fromBase', {
  get:function() {
    return this.__proto__
  }
})

define( proto, '$children', {
  value:{
    $Constructor: exports 
  },
  writable:true 
})

define( proto, '$getVal', {
  value:function() { 
  }
})

define( proto , '$val', {
  get:function() {
    return this.$getVal()
  },
  set:function(val) {

  }
})

define( proto, '$set', { value: function( val ) {
    if(val instanceof Object) {
      for( var key$ in val ) {
        this.$setKey( key$, val[key$] )
      }
    } else {
      this._$val = val
    }
  }
})


window.keyCnt = 0
define( proto, '$setKey', {
  //hier moet ook iets in als hasownprop constructor (if used a a constructor)
  //guards voor ik maak iets nieuws make getter to update insatcnes correctly as well

  value:function( key, value ) {

    // if(key[])

    //if not like this it does not store shit -- pretty bad check into setter its flawed now
    //seems to get the wrong this
    var added = '_'+key

    if(this[added]) {
      // window.keyCnt++


      //dit add letterlijk 0.2 sec (evenveel als al het andere doen...)
      //vershil tussen dingen opslaan op _ is x2.5 in speed (op 500k)

      //dit wat de slowness verooraakt
      key = added
      //deze moeten stored worden in __ denk ik.... of # zoiets 
    }



    if(this[key] && this[key]._$parent !== this) {
      // console.info(key, this[key] && this[key]._$parent)

      this[key] = new this[key].$Constructor( value, this )
    } else if(this[key]) {
      this[key].$set( value )
    } else {
      this[key] = new this.$children.$Constructor( value, this )
      this[key]._$name = key 
    }
  }
})

define( proto, '$Constructor', {
  set:function(val) {
    //overwrite defaults!
  },
  get:function() {
    if(!this.hasOwnProperty( '_$Constructor' )) {
      
      // dit maakt alles ultra slows 3x slower hellaas....
      // console.log('?')
      for(var key$ in this) {
        if(key$[0]!=='_' && !this['_'+key$]) {
          this.$createContextGetter.call(this, key$)
        }
      }

      define(this, '_$Constructor', {
        value:function derivedBase( val, parent) {
          this._$parent = parent
          if(val) {
            this.$set( val )
          }
        }
      })
      this._$Constructor.prototype = this
    }
    return this._$Constructor
  }
})

require('./util')
require('./path')
// require('./get')
