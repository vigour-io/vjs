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
        // console.error(key, privateKey, this.$path)

        var value = this[privateKey]
        if( value instanceof Base ) {
          if( !this.hasOwnProperty( privateKey ) ) {
            value._$context = this
            value._$contextLevel = 0
          } else if( this._$context ) {
            value._$contextLevel = this._$contextLevel + 1
            value._$context = this._$context
          } else {
            value.$clearContext()
          }  
        }
        return value
      },
      set: function( val ) {
        this[privateKey] = val
      },
      configurable:true
    })
  }
}

var cnt = 0

exports.$resolveContextSet = function( val, event ) {

  var cLevel = this._$contextLevel
  var path = this.$path
  var parent = this._$context
  var length = path.length
  var setObj = {}
  var nobj = setObj
  var notchanged
  
  for( var i = length-cLevel-1; i < length; i++ ) {
    if( i === length-1 ) {
      nobj[path[i]] = val
    } else {
      nobj[path[i]] = nobj = {}
    }
  }

  if(event) {
    event.$block = true
    notchanged = parent.$set( setObj, event, true )
    event.$block = null
  } else {
    console.warn('no event in resolvecontext', this.$path)
    notchanged = parent.$set( setObj, void 0, true )
  }

  return notchanged
}

exports.$clearContext = function() { 
  //this is cleaner else null will be added on base and some things dont use this
  if( this._$context ) { 
    this._$contextLevel = null
    this._$context = null
    this._$contextKey = null
  }
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
  set:function( val ) {
    this._$parent = val
  }
}

exports.$path = {
  get:function() {
    var path = []
    var parent = this
    while( parent && parent._$key !== void 0 ) {
      path.unshift( parent._$contextKey || parent._$key )
      parent = parent.$parent// || parent.$context
    }
    return path
  }
}