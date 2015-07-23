"use strict";

var Base = require('./')
var util = require('../util')

//maybe later make all these nested methods on a seperate thing e.g. 
//privateMethods
//saves lookup on objects

/*
  this._$contextLevel = null
  this._$context = null
  this._$contextKey = null
*/

//rename to removeFromParent
exports.$removeUpdateParent = function( parent, event, context ) {
  if( parent[this._$key] === null ) {
    return true
  }
  if( context ) {
    this.$resolveContextSet( null, event )
  } else {
    parent[this._$key] = null
  }
}

exports.$removeProperty = function( property, key, event, nocontext ) {
  //!this can be geatly optimized!
  //???how to get rid of the non-enum stuff??? (fix this when resolving define and inject)
  //system voor excludes
  if( key !== '_$key' && key !== '$postPonedStamp'  ) {
    if( this.hasOwnProperty( key )) {
      if( key !== '_$parent'  ) {
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
  
exports.$removeInternal = function( event, nocontext, noparent ) {

  var parent = this._$parent
  var contextParent

  if( !noparent && !nocontext && this._$context ) {
    // console.warn(
    //   'context removal' ,
    //   'parent:', this.$parent.$path, 
    //   'for:', this._$key , 
    //   'context:', this.$path, 
    //   'orginaly from:', this._$parent.$path
    // )
    return this.$removeUpdateParent( this.$parent, event, this._$context )
  } else {
    
    if( !noparent && parent ) {
      this.$removeUpdateParent( parent, event )
    }
    
    for( var key$ in this ) {
      this.$removeProperty( this[key$], key$, event, nocontext )
    }

    this._$val = null
  }
}

exports.remove = function( event, nocontext, noparent ) {
  if( this._$val === null ) {
    console.warn( 'allready removed' )
    return true
  }
  return this.$removeInternal( event, nocontext, noparent )
}

