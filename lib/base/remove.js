"use strict";

var Base = require('./')
var util = require('../util')

exports.$removeUpdateParent = function( parent, instances, event ) {
  //has to emit property and change

  //also remove each instances (this will become a very hard thing)
  delete parent[this._$key]
}

exports.$removeUpdateContextParent = function( parent, event ) {
  //???removeContextGetter???
  parent[this._$key] = null
}

exports.$removeInternal = function( instances, event ) {

  var parent = this._$parent
  var contextParent

  if( !instances && parent !== ( contextParent = this.$parent ) ) {
    console.warn(
      'context removal' ,
      'parent:', this.$parent.$path, 
      'for:', this._$key , 
      'context:', this.$path, 
      'orginaly from:', this._$parent.$path
    )
    return this.$removeUpdateContextParent( contextParent, event )
  } else {
    if( parent ) {
      this.$removeUpdateParent( parent, instances, event )
    }
    for( var key$ in this ) {
      // console.error('wtf ', key$)
      if( this.hasOwnProperty( key$ ) ) {
        var property = this[key$]

        if( key$ !== '_$parent' ) {
          if( property instanceof Base ) {
            if(key$ !== '_$val') {
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
  }
}

exports.remove = function( instances, event ) {
  if( this._$val === null ) {
    console.warn( 'allready removed' )
    return true
  }
  return this.$removeInternal( instances, event )
}

