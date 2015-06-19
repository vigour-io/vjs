"use strict";
//!! cosumizable constructor super important
//of gewoon on new gebruiken zou in de meeste gevallen het wel moeten fixen...

/**
 * @class  Base
 * @param  {Event} event
 * @param  {object} [value]
 * @param  {base} [parent]
 * @param  {string} [key]
 * @return {base}
 */
var Base = module.exports = function Base( val, event, parent, key ) {
  if(parent) {
    this._$parent = parent
  }
  if(key) {
    this._$key = key
  }
  if(val) {
    this.$set( val, event )
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
    //overwrite defaults! -- create your own! 
  },
  get:function() {
    if(!this.hasOwnProperty( '_$Constructor' )) {

      for(var key$ in this) {
        if(key$[0]!=='_' && !this['_'+key$]) {
          this.$createContextGetter.call(this, key$)
        }
      }

      define(this, '_$Constructor', {
        value:function derivedBase( val, event, parent, key ) {
          if(parent) {
            this._$parent = parent
          }
          if(key) {
            this._$key = key
          }
          if(val) {
            this.$set( val, event )
          }
        }
      })

      this._$Constructor.prototype = this
    }

    return this._$Constructor
  }
})

//only used to seperate this file
require('./on/update')
require('./util')
require('./context')
require('./set')
require('./val')
require('./on')

