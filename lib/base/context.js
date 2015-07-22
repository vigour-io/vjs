"use strict";

var Base = require('./index.js')
var define = Object.defineProperty

/**
 * @function $createContextGetter
 * @memberOf Base#
 * @param  {string} key Key to create the context getter for
 */
exports.$createContextGetter = function( key, value ) {

  if(!value) {
    value = this[key]
  } 

  if( value && value.$createContextGetter ) {
    var privateKey = '_'+key
    this[privateKey] = value
    for( var val_key in value ) {
      if( val_key[0] !== '_' && !value['_'+val_key] ) {
        value.$createContextGetter( val_key )
      }
    }
    define( this, key, {
      get: function(){
        var value = this[privateKey]

        if( value instanceof Base ) {
          if(!this.hasOwnProperty( privateKey )) {
            value._$context = this
            value._$contextLevel = 0
          } else if( this._$context ) {
            value._$contextLevel = this._$contextLevel + 1
            value._$context = this._$context
          } else {
            value._$contextLevel = null
            value._$context = null
            value._$contextKey = null
          }  
        }
        return value
      },
      set:function( val ) {
        this[privateKey] = val
      },
      configurable:true
    })
  }
}

exports.$clearContext = function() {
  this._$contextLevel = null
  this._$context = null
  this._$contextKey = null
  return this
}

/**
 * Parent of base object
 * @name  $parent
 * @memberOf Base#
 * @type {base}
 */
exports.$parent = {
  get:function() {
    return this._$contextLevel === 0
      ? this._$context 
      : this._$parent
  },
  set:function(val) {
    this._$parent = val
  }
}

exports.$path = {
  get:function() {
    var path = []
    var parent = this
    while(parent && parent._$key !== void 0) {
      path.unshift(parent._$contextKey || parent._$key)
      parent = parent.$parent
    }
    return path
  }
}

/**
//REMOVE THIS MOVE IT TO LIST!
 * @function $createListContextGetter
 * @memberOf Base#
 * @param  {string} key Key to create the context getter for
 */
exports.$createListContextGetter = function( key ) {
  var value = this[key]
  if(value) {
    var privateKey = '_'+key
    this[privateKey] = value
    define( this, key, {
      get: function(){
        var value = this[privateKey]
        if(value instanceof Base) { 
          if(value._$parent !== this) {
            value._$context = this
            value._$contextLevel = 0
            if(key !== value._$key) {
              value._$contextKey = key
            }
          } else if( this._$context ) {
            value._$contextLevel = this._$contextLevel + 1
            value._$context = this._$context
          } else {
            value._$contextLevel = null
            value._$context = null
            value._$contextKey = null
          } 
        }
        return value
      },
      set:function(val) {
        this[privateKey] = val
      },
      configurable:true
    })
  }
}

