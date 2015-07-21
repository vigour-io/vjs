"use strict";

var Base = require('./')
var util = require('../util')

exports.$removeUpdateParent = function( parent, event ) {
  //???removeContextGetter???
  parent[this._$key] = null
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

      //!this can be geatly optimized!
      //???how to get rid of the non-enum stuff??? (fix this when resolving define and inject)

      if( this.hasOwnProperty( key$ ) && key$ !== '_$key' && key$ !== '$postPonedStamp' ) {
        var property = this[key$]

        if( key$ !== '_$parent'  ) {
          if( property instanceof Base ) {
            if( key$ !== '_$val' ) {
              property.remove( event )
            } else {
              console.error('remove _$val')
            }
          }  
        }

        //on needs to know if parent is removed
        this[key$] = null
        //much rather null (perf)

      }
    }

    this._$val = null
    // this._$key = null
    // this.$postPonedStamp = null
  }
}

exports.remove = function( event ) {
  if( this._$val === null ) {
    console.warn( 'allready removed' )
    return true
  }
  return this.$removeInternal( event )
}

