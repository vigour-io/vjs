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


  // //try with normal set
  // var obj = {}
  // var temp = obj
  // for( i = 0; i < pathLength-1; i++ ) {
  //   //this is wrong needs to resolve from the top to bottom
  //   temp = temp[path[i]] = {}
  // }
  // temp[path[pathLength-1]] = val
  // context.set( obj, false ) //setting this to false fixes everything
  //
  // //seems that the event gets fired for the original or something
  //
  // context = context.get( path )
  // console.log(context instanceof this.$Constructor, path)
  // // console.log()
  // //slower bit fixes 'simple fail'

  for( i = 0; i < pathLength; i++ ) {
    //this is wrong needs to resolve from the top to bottom

    //make a function or something
    //can be optmized by removing the pathLengthCompare
    //just have to set the val at the end
    //do perf tests next week

    if(context) {
      // console.log('%c set context:', 'color:purple;font-weight:bold;', path[i])
      context.$clearContext()
      context = context.$setKeyInternal( path[i],
      i === pathLengthCompare ? val : {},
      context[path[i]],
      event, //so weird!
      true )
    }

    // else {
    //   console.error('oops no context for', path[i])
    // }

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
    //TODO: wrong needs to call update parent etc
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
