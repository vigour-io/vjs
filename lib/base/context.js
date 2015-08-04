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
  var i = cLevel + 1
  var context = this._$context

  var iterator = this
  var path = []

  while( i ) {
    var key = iterator._$key
    path.unshift( key )
    iterator = iterator._$parent
    i--
  }


  for (i = 0; i < path.length; i++) {
    context = context.$setKeyInternal(path[i],
      i === path.length - 1 ? val : {},
      context[path[i]],
      event,
      true);
  }

  return context;
}


exports.$resolveContextSet2 = function( val, event ) {
  var cLevel = this._$contextLevel
  var i = cLevel + 1
  var context = this._$context
  var setObj = {}
  var nobj = setObj

  var iterator = this
  var path = []


  while( i ) {
    var key = iterator._$key
    path.unshift( key )
    iterator = iterator._$parent

    if( i === cLevel + 1 ) {
      setObj = {}
      setObj[key] = val
    } else {
      nobj[path[i]] = nobj = {}
      var oldsetobj = setObj
      setObj = {}
      setObj[key] = oldsetobj
    }
    i--
  }

  context.set( setObj, event || void 0, true )
  return context.get( path )
}


exports.$clearContext = function() {
  //this is cleaner else null will be added on base and some things
  //dont use this
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
