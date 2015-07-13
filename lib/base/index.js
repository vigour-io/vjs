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
  setParent.apply( this, arguments )
  if( val !== void 0 ) {
    //think about this (false) its good for performance
    this.$set( val, event || false )
  } 
  //idea of not executing new emitter is 
  //it should not be nessecary if its a base without anything 
}

var proto = Base.prototype
var define = Object.defineProperty

define( proto, '$fromBase', {
  get:function() {
    return this.__proto__
  },
  configurable:true
})

//path is less important is not used anywhere
define( proto, '$path', {
  get:function() {
    //add perf optimizations here!
    var path = []
    var parent = this
    while(parent && parent._$key !== void 0) {
      path.unshift(parent._$contextKey || parent._$key)
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

define( proto, '$generateConstructor', {
  value:function() {
    return (function derivedBase( val, event ) {
      setParent.apply( this, arguments )
      if(val) {
        event = this.$set( val, event )
      }  
      this.$emit( '$new', event )
    })
  },
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
      this._$Constructor = this.$generateConstructor()
      this._$Constructor.prototype = this
    }
    return this._$Constructor
  },
  configurable:true
})

function setParent( val, event, parent, key ) {
  if(parent) {
    this._$parent = parent
  }
  if(key !== void 0) {
    this._$key = key
  }
}

//only used to seperate this file (core)
require('./util')
require('./on/emit')
require('./set')

//----------here we can start using $define flag------
require('./context')
require('./val')
require('./on')

