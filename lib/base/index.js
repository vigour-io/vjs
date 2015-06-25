"use strict";
//!! cosumizable constructor super important
//of gewoon on new gebruiken zou in de meeste gevallen het wel moeten fixen...

/**
 * @class  Base
 * @todo find a better name
 * @param  {*} val
 * @param  {Event} [event]
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
  this.$emit( '$new', event )
}

var proto = Base.prototype
var define = Object.defineProperty

define( proto, '$fromBase', {
  get:function() {
    return this.__proto__
  },
  configurable:true
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
  },
  configurable:true
})

//!!!!! this will become something like 'constructor' or child constructor
define( proto, '$ChildConstructor', {
  value:Base ,
  configurable:true
})


define( proto, '$Constructor', {
  set:function(val) {
    this._$generateConstructor = val
    // overwrite defaults! -- create your own need to return a function! 
  },
  get:function() {
    if(!this.hasOwnProperty( '_$Constructor' )) {

      for(var key$ in this) {
        if(key$[0]!=='_' && !this['_'+key$]) {
          this.$createContextGetter.call(this, key$)
        }
      }

      //lookup is fucked make nested object for this
      if(this._$generateConstructor) {
        this._$Constructor = this._$generateConstructor()
      } else {
        this._$Constructor = function derivedBase( val, event, parent, key ) {
          Base.apply( this, arguments )
        }
      }
      this._$Constructor.prototype = this
    }
    return this._$Constructor
  },
  configurable:true
})

//only used to seperate this file (core)
require('./util')
require('./on/emit')
require('./set')

//----------here we can start using $define flag------
require('./context')
require('./val')
require('./on')

