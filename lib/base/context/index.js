"use strict";
var Base = require('../index.js')
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
          if( !this.hasOwnProperty( privateKey ) ) {
            value._$context = this
            value._$contextLevel =  1
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

exports.$resolveContextSet = function( val, event, context ) {

  //this one is still wrong...
  //---------

  var i = this._$contextLevel
  var context = context || this._$context
  var iterator = this
  var path = []
  while( i ) {
    var key = iterator.$key
    path.unshift( key )
    iterator = iterator._$parent
    i--
  }

  var resolveEventOrigin = event && event.$origin === this && event.$context === context

  var pathLength = path.length
  var pathLengthCompare = pathLength - 1

  if(event) {
    event.$block = true
  }

  for( i = 0; i < pathLength; i++ ) {
    if(context) {
      context.$clearContext()
      context = context.$setKeyInternal( path[i],
      i === pathLengthCompare ? val : {},
      context[path[i]],
      event, //false, //event, //so weird!
      true )
    }
  }
  // context.$clearContextUp()

  if(event) {
    event.$block = null
  }

  if (resolveEventOrigin) {
    console.error('------?resolve?-----', event.$postponed)
    event.$context = null
    event.$origin = context
  }

  return context
}

/**
 * Parent of base object
 * @name  $parent
 * @memberOf Base#
 * @type {base}
 */
exports.$parent = {
  get:function() {
    if(this._$contextLevel) {
      if(this._$contextLevel === 1) {
        return this._$context
      } else if(this._$contextLevel) {
        if(this._$parent && !this._$parent._$context !== this._$context ) {
          /*
            this is where it fails
          */
          this._$parent._$context = this._$context
          this._$parent._$contextLevel = this._$contextLevel-1
          return this._$parent
        } else {
          return this._$parent
        }
      }
    } else {
      if(this._$parent && this._$parent._$context) {
        this._$parent.$clearContext()
      }
      return this._$parent
    }
  },
  set:function( val ) {
    //TODO: wrong needs to call update parent etc
    this._$parent = val
  }
}

//TODO: share more here! (but smart)
//TODO: perf tests (reverse at the end perhaps faster?)
exports.$path = {
  get:function() {
    var path = []
    var parent = this
    while( parent && parent.$key !== void 0 ) {
      path.unshift( parent.$key )
      parent = parent.$parent
    }
    return path
  }
}

exports._$path = {
  get:function() {
    var path = []
    var parent = this
    while( parent && parent.$key !== void 0 ) {
      path.unshift( parent.$key )
      parent = parent._$parent
    }
    return path
  }
}
