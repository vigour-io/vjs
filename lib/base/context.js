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
          if( !this.hasOwnProperty( privateKey ) ) {
            value._$context = this
            value._$contextLevel = 1
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


exports.$resolveContextSet = function( val, event, context ) {
  var i = this._$contextLevel
  var context = context || this._$context

  if(!context) {
    console.error('not context')
  }

  var iterator = this
  var path = []

  while( i ) {
    var key = iterator.$key
    path.unshift( key )
    iterator = iterator._$parent
    i--
  }

  var resolveEventOrigin = event && event.$origin && event.$context === context

  for (i = 0; i < path.length; i++) {
    context = context.$setKeyInternal(path[i],
      i === path.length - 1 ? val : {},
      context[path[i]],
      event,
      true);
  }

  if (resolveEventOrigin) {
    event.$context = null
    event.$origin = context
  }

  return context;
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

    //like this is extra confuse!
    if(this._$contextLevel === 1) {
      return this._$context
    } else if(this._$contextLevel) {
      //set context on parent based on current context
      if(this._$parent && !this._$parent._$context) {
        // console.error('XXXXXXX???XXXXXX', this._$parent)

        //find level from context
        this._$parent._$context = this._$context
        this._$parent._$contextLevel = this._$contextLevel-1

      } else {
        return this._$parent // this.hasOwnProperty('_$parent') && this._$parent
      }
    } else {
      return this._$parent // this.hasOwnProperty('_$parent') && this._$parent
    }

    // return this._$contextLevel === 1
    //   ? this._$context
    //   : this._$parent
  },
  set:function( val ) {
    this._$parent = val
  }
}

exports.$clearContextPath = function() {
  // if( this._$context ) {
  //   console.log('??', instance)
  //
  //   var instance = this
  //   var length = this._$contextLevel;
  //   for( var i = 0; i < length; i++ ) {
  //     if(instance) {
  //       console.log('????', instance)
  //       instance.$clearContext()
  //     }
  //     instance = instance._$parent
  //   }
  //   // this.$clearContext()
  // }
  var parent = this
  // this.$clearContext()
  while( parent ) {
    parent.$clearContext()
    parent = parent._$parent
  }

}

exports.$path = {
  get:function() {
    var path = []
    var parent = this
    while( parent && parent.$key !== void 0 ) {
      path.unshift( parent._$contextKey || parent.$key )
      parent = parent.$parent// || parent.$context
    }
    return path
  }
}
