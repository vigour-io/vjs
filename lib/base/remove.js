"use strict";

var Base = require('./')
var util = require('../util')

//maybe later make all these nested methods on a seperate thing e.g. 
//privateMethods
//saves lookup on objects

//rename to removeFromParent
exports.$removeUpdateParent = function( parent, event ) {
  if( parent[this._$key] === null ) {
    return true
  }
  parent[this._$key] = null
}

exports.$removeProperty = function( property, key, event ) {
  //!this can be geatly optimized!
  //???how to get rid of the non-enum stuff??? (fix this when resolving define and inject)
  //system voor excludes
  if( this.hasOwnProperty( key ) && key !== '_$key' && key !== '$postPonedStamp' ) {
    if( key !== '_$parent'  ) {
      if( property instanceof Base ) {
        if( key !== '_$val' ) {
          //block if everything is allreayd removed?
          if( property._$parent === this ) {
            property.remove( event )
          } 
        } else {
          console.error('remove _$val')
        }
      }  
    }
    this[key] = null
  }
}
  
exports.$removeInternal = function( event ) {

  var parent = this._$parent
  var contextParent

  if( parent !== ( contextParent = this.$parent ) ) {
    console.warn(
      'context removal' ,
      'parent:', this.$parent.$path, 
      'for:', this._$key , 
      'context:', this.$path, 
      'orginaly from:', this._$parent.$path
    )
    return this.$removeUpdateParent( contextParent, event )
  } else {
    
    if( parent ) {
      this.$removeUpdateParent( parent, event )
    }
    
    for( var key$ in this ) {
      this.$removeProperty( this[key$], key$, event )
    }

    this._$val = null

  }
}

exports.remove = function( event ) {
  if( this._$val === null ) {
    console.warn( 'allready removed' )
    return true
  }
  return this.$removeInternal( event )
}

