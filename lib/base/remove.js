"use strict";

var Base = require('./')
var util = require('../util')

//rename to removeFromParent
exports.removeUpdateParent = function( parent, event, context ) {
  if( parent[this.key] === null ) {
    return true
  }
  
  if( context ) {
    if( this._context ) {
      // console.error( '\n\n\n\n\n\nhey what resolving context???', this.path )
      this.resolveContextSet( null, event, context )
    }
  } else {
    // console.warn('null key', this.key)
    parent[this.key] = null
  }
}

exports.removeProperty = function( property, key, event, nocontext ) {
  //!this can be geatly optimized!
  //???how to get rid of the non-enum stuff??? (fix this when resolving define and inject)
  //system voor excludes
  if( key !== 'key' ) {
    if( this.hasOwnProperty( key )) {
      if( key !== '_parent' ) {
        if( property instanceof Base ) {
          if( key !== '_input' ) {
            //block if everything is allreayd removed?
            if( property._parent === this ) {

              //TODO: 10 double check this....
              
              property.clearContext()
              //look fishy...
              property.remove( event, nocontext )
            }
          }
        }
      }

      this[key] = null
    } else {
      if(this._context) {
        console.warn('maybe some stuff going wrong with context here in removeprop')
      }
      this[key] = null
    }
  }
}

exports.removeProperties = function( event, nocontext, noparent ) {
  for( var key in this ) {
    if (key === '_parent') {
      continue;
    } else {
      this.removeProperty( this[key], key, event, nocontext )
    }
  }

  this._parent = null;
  this.parent = null;
  this._input = null
}

exports.removeInternal = function( event, nocontext, noparent ) {
  var parent = this._parent
  if( !noparent && !nocontext && this._context ) {
    return this.removeUpdateParent( this.parent, event, this._context )
  } else {
    if( !noparent && parent ) {
      this.removeUpdateParent( parent, event )
    }
    this.removeProperties(  event, nocontext, noparent )
  }
}

exports.remove = function( event, nocontext, noparent ) {
  // if( this._input === null ) {
  //   console.warn( 'already removed' )
  //   return true
  // }
  return this.removeInternal( event, nocontext, noparent )
}
