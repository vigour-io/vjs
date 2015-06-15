"use strict";

var Base = require('./index.js')
var proto = Base.prototype
var define = Object.defineProperty

define(proto, '$convert', {
  value:function( options ) {
    var fnToString = options && options.fnToString
    var obj = {}
    for(var key$ in this) {
      if(key$[0]!=='_') {
        obj[key$] = this[key$].$convert 
          && this[key$].$convert() 
          || this[key$] 
      }
    }
    if(this._$val) {
      if( fnToString && typeof this._$val === 'function' ) {
        obj.$val = String(this._$val)
      } else {
        obj.$val = this._$val
      }
    }
    return obj
  }
})

define(proto, '$toString', {
  value:function() {
    return JSON.stringify( this.$convert({
      fnToString: true
    }), false, 2 )
  }
})

define(proto, '$keys', {
  get:function() {
    var keys = []
    //this can be extra fast by caching and updating (speed)
    for(var key$ in this) {
      keys.push(key$)
    }
    return keys
  }
})


