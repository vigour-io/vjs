"use strict";

var Base = require('./index.js')
var proto = Base.prototype
var define = Object.defineProperty

define( proto, '$convert', {
  value:function( options ) {
    var fnToString = options && options.fnToString
    var obj = {}
    var val = this._$val
    for(var key$ in this) {
      if(key$[0]!=='_') {
        obj[key$] = this[key$].$convert 
          && this[key$].$convert( options ) 
          || this[key$] 
      }
    }
    if( val ) {
      if( fnToString && typeof val === 'function' ) {
        obj.$val = String(val)
      } else {
        if(val instanceof Base) {
          //hier parsen van ref als optie maken ($val)
          obj.$val = { $reference: val.$path }
        } else {
          obj.$val = val
        }
      }
    }
    return obj
  }
})

define( proto, '$toString', {
  value:function() {
    return JSON.stringify( this.$convert({
      fnToString: true
    }), false, 2 )
  }
})

define( proto, '$keys', {
  get:function() {
    var keys = []
    //this can be extra fast by caching and updating (speed)
    for(var key$ in this) {
      keys.push(key$)
    }
    return keys
  }
})

//path util --- context ect ect all needs to be taken into account must be able to use it in sets etc
//get by path

//notation in path for until found somwhere up , maybe also until found down

//find

//get 
  //argument

//merge

//remove

//clear

// bla.pathFinder('findInParent.yuzi.findInChild.jim')
// bla.

