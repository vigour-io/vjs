"use strict";

var Base = require('./')
var util = require('../util')

exports.$removeUpdateParent = function( parent, event ) {
  //has to emit property and change
  delete parent[this._$key]
}

exports.$removeInternal = function( event, excludes, passon ) {
  var parent = this._$parent
  
  if( parent ) {
    this.$removeUpdateParent( parent, event )
  }

  for( var key$ in this ) {
    if( this.hasOwnProperty( key$ ) ) {
      var property = this[key$]

      //also add function support
      if( !excludes || 
          ( typeof excludes === 'function' 
            ? !excludes( this[key$], key$, this, passon ) 
            : key$ !== excludes 
          )
      ) {
        if( property instanceof Base ) {
          if(key$ !== '_$val') {
            property.remove( event )
          } else {
            console.error('remove _$val')
          }
        }  
        delete this[key$]
      }
      //much rather null (perf)
    }
  }
  this._$val = null
}

exports.remove = function( event, excludes, passon ) {
  if( this._$val === null ) {
    console.warn( 'allready removed' )
    return true
  }
  return this.$removeInternal( event, excludes, passon )
}

