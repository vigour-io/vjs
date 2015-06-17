"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

define( proto, '_$bind', {
  writable:true,
  configurable:true
})

define( proto, '$origin', {
  get:function() {
    var reference = this
    while( reference._$val instanceof Base ) {
      reference = reference._$val
    }
    return reference
  }
})

define( proto, '$parseValue', {
  value:function() { 
    var val = this._$val
    if(val) {
      //special flag dat functie niet geget moet worden
      //dit is voor methods
      if(typeof val === 'function') {
        //make this into a funciton e.g. $execGetterFunction
        var context = this._$bind && this._$bind._$val || this
        if(context) {
          if(context === '$parent') { 
            //this will be replaced with a general path functionality (that includes)
            context = this.$parent
          } else if(typeof context === 'function' ) {
            context = context.call(this)
          } else {
            context = this
          }
        }
        return val.call(context)
      } else if( val instanceof Base ) {
        return val.$val
      } else {
        return this._$val
      }
      
    } else {
      return this
    }
  }
})

define( proto , '$val', {
  get:function() {
    return this.$parseValue()
  },
  set:function( val ) {
    this.$set( val )
  }
})

proto.$flags.$val = function( val ) {
  this._$val = val
}


//setKey super important





//operators gewoon hetzelfde doen (alleen in een prop die je dan lekker zelf kan extenden en veranderen)

//doing defines within sets etc

//that would be a great shortcut as well -- still hate the idea of having to check for fields in something like

//specialFields: {} --- ugh puke....

//how to do operators , 
//how to define defaults /w special settings? pretty lame to add transform etc on everything (makes gets rly slow as well)

//we need defaults for certain fields , maybe make a hook in setKey , so you can also add $val for example?
//this is prop the fastest way
//else everything nees to be added to inehiratble proto
//however making every set slower is rly fucking lame as well...
// define( proto , '$operators', {
//   value: {},
//   writable: true,
//   configurable: true
// })

//everything needs configurable: true
//make our own define( merges a descriptor object /w configurable)