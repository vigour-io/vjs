"use strict";

var Base = require('./')
var util = require('../util')

//rename to removeFromParent
exports.$removeUpdateParent = function( parent, event, context ) {
  if( parent[this._$key] === null ) {
    return true
  }
  if( context ) {
    if( this._$context ) {
      this.$resolveContextSet( null, event, context )
    }
  } else {
    parent[this._$key] = null
  }
}

exports.$removeProperty = function( property, key, event, nocontext ) {
  //!this can be geatly optimized!
  //???how to get rid of the non-enum stuff??? (fix this when resolving define and inject)
  //system voor excludes
  if( key !== '_$key' && key !== '$emitterStamps'  ) {
    if( this.hasOwnProperty( key )) {
      if( key !== '_$parent' ) {
        if( property instanceof Base ) {
          if( key !== '_$val' ) {
            //block if everything is allreayd removed?
            if( property._$parent === this ) {
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

exports.$removeInternalBody = function( event, nocontext, noparent ) {
  for( var key$ in this ) {
    this.$removeProperty( this[key$], key$, event, nocontext )
  }
  this._$val = null
}

exports.$removeInternal = function( event, nocontext, noparent ) {
  var parent = this._$parent
  if( !noparent && !nocontext && this._$context ) {
    return this.$removeUpdateParent( this.$parent, event, this._$context )
  } else {
    if( !noparent && parent ) {
      this.$removeUpdateParent( parent, event )
    }
    this.$removeInternalBody(  event, nocontext, noparent )
  }
}

exports.remove = function( event, nocontext, noparent ) {
  if( this._$val === null ) {
    console.warn( 'already removed' )
    return true
  }
  return this.$removeInternal( event, nocontext, noparent )
}
