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

  console.group()
  console.log('\n')
  console.log('%cresolve context', 'color:pink;font-weight:bold;background:#333; padding:4px;'
  ,this._$path, context._$path)
  console.log('\n')
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
  // if(event) {
  //   event.$block = true
  // }
  //gain speed cache vars
  for (i = 0; i < pathLength; i++) {
    //this is wrong needs to resolve from the top to bottom
    console.group()
    console.log('\n')
    console.log('%csetkeyinternal', 'color:pink;font-weight:bold;background:#333; padding:4px;'
    , path[i], context._$path)
    console.log('\n')
    //this may be wrong
    //how to check if same?

    //console.log(val)
    context = context.$setKeyInternal( path[i],
      i === path.length - 1 ? val : {},
      context[path[i]],
      false, //this will break cases like bla.b.c set ( 2 levels in setobj )
      true);

    console.groupEnd()
  }


  // if(event) {
  //   event.$block = null
  // }
  if (resolveEventOrigin) {
    console.log('%clets resolve event', 'color:pink;font-weight:bold;background:#333; padding:4px;')
    event.$context = null
    event.$origin = context
  }

  console.log('\n')
  console.log('%cRESOLVED CONTEXT', 'color:pink;font-weight:bold;background:#333; padding:4px;' , context.$path)
  console.log('\n')
  console.groupEnd()


  return context;
}

exports.$clearContext = function() {
  //this is cleaner else null will be added on base and some things
  //dont use this
  if( this._$context ) {
    this._$contextLevel = null
    this._$context = null
    // this._$contextKey = null
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
    if(this._$contextLevel) {
      if(this._$contextLevel === 1) {
        return this._$context
      } else if(this._$contextLevel) {
        //set context on parent based on current context
        if(this._$parent && !this._$parent._$context) {
          this._$parent._$context = this._$context
          this._$parent._$contextLevel = this._$contextLevel-1
        } else {
          return this._$parent
        }
      }
    } else {
      return this._$parent
    }
  },
  set:function( val ) {
    this._$parent = val
  }
}

exports.$resetContextsUp = function( diff ) {
  var parent = this
  if( !diff ) {
    while( parent ) {
      parent.$clearContext()
      parent = parent._$parent
    }
  } else {
    var i = 0
    while( parent ) {
      if( diff[i] ) {
        //is a context store (array?) diff[i]
        parent._$context = diff[i]
        parent._$contextLevel = i
        //contextKey!!!!! ???
      } else {
        parent.$clearContext()
      }
      i++
      parent = parent._$parent
    }
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
