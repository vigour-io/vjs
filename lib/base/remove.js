"use strict";

var Base = require('./')
var util = require('../util')

exports.$removeUpdateParent = function( parent, event ) {
  //has to emit property and change
  delete parent[this._$key]
}

exports.$removeInternal = function( event ) {

  var parent = this._$parent
  
  if( parent ) {
    this.$removeUpdateParent( parent, event )
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

      delete this[key$]
      //much rather null (perf)
    }
  }
  this._$val = null
}

exports.remove = function( event ) {
  if( this._$val === null ) {
    console.warn( 'allready removed' )
    return true
  }
  return this.$removeInternal( event )
}

