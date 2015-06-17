"use strict";
//!! cosumizable constructor super important
//of gewoon on new gebruiken zou in de meeste gevallen het wel moeten fixen...
var Base = module.exports = function Base( val, parent, key ) {
  if(parent) {
    this._$parent = parent
  }
  if(key) {
    this._$key = key
  }
  if(val) {
    this.$set( val )
  }
}

var proto = Base.prototype
var define = Object.defineProperty

define( proto, '$fromBase', {
  get:function() {
    return this.__proto__
  }
})

define( proto, '$path', {
  get:function() {
    //add perf optimizations here!
    var path = []
    var parent = this
    while(parent && parent._$key) {
      path.unshift(parent._$key)
      parent = parent.$parent
    }
    return path
  }
})

//!!!!! this will become something like 'constructor' or child constructor
define( proto, '$ChildConstructor', {
  value:Base ,
  configurable:true
})

define( proto, '$Constructor', {
  set:function(val) {
    //overwrite defaults!
  },
  get:function() {
    if(!this.hasOwnProperty( '_$Constructor' )) {

      for(var key$ in this) {
        if(key$[0]!=='_' && !this['_'+key$]) {
          this.$createContextGetter.call(this, key$)
        }
      }

      define(this, '_$Constructor', {
        value:function derivedBase( val, parent, key ) {
          if(parent) {
            this._$parent = parent
          }
          if(key) {
            this._$key = key
          }
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

//only used to seperate this file
require('./util')
require('./context')
require('./set')
require('./val')
