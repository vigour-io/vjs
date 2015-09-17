"use strict";

var Base = require('./')
var util = require('../util')

//rename to removeFromParent
exports.$removeUpdateParent = function( parent, event, context ) {
  if( parent[this.$key] === null ) {
    return true
  }
  // console.log('im removing those keys! from parents')
  if( context ) {
    if( this._$context ) {
      // console.error( '\n\n\n\n\n\nhey what resolving context???', this.$path )
      this.$resolveContextSet( null, event, context )
    }
  } else {
    // console.warn('null key', this.$key)
    parent[this.$key] = null
  }
}

exports.$removeProperty = function( property, key, event, nocontext ) {
  //!this can be geatly optimized!
  //???how to get rid of the non-enum stuff??? (fix this when resolving define and inject)
  //system voor excludes
  if( key !== '$key' ) {
    if( this.hasOwnProperty( key )) {
      if( key !== '_$parent' ) {
        if( property instanceof Base ) {
          if( key !== '_$input' ) {
            //block if everything is allreayd removed?
            if( property._$parent === this ) {

              //TODO: 10 double check this....
              // console.log('is this smart?')
              property.$clearContext()
              //look fishy...
              property.remove( event, nocontext )
            }
          }
        }
      }

      this[key] = null
    } else {
      if(this._$context) {
        console.warn('maybe some stuff going wrong with context here in removeprop')
      }
      this[key] = null
    }
  }
}

exports.$removeProperties = function( event, nocontext, noparent ) {
  for( var key$ in this ) {
    if (key$ === '_$parent') {
      continue;
    } else {
      this.$removeProperty( this[key$], key$, event, nocontext )
    }
  }

  this._$parent = null;
  this.$parent = null;
  this._$input = null
}

exports.$removeInternal = function( event, nocontext, noparent ) {
  var parent = this._$parent
  if( !noparent && !nocontext && this._$context ) {
    return this.$removeUpdateParent( this.$parent, event, this._$context )
  } else {
    if( !noparent && parent ) {
      this.$removeUpdateParent( parent, event )
    }
    this.$removeProperties(  event, nocontext, noparent )
  }
}

exports.remove = function( event, nocontext, noparent ) {
  // if( this._$input === null ) {
  //   console.warn( 'already removed' )
  //   return true
  // }
  return this.$removeInternal( event, nocontext, noparent )
}
