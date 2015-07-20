"use strict";

var Base = require('./')
var util = require('../util')

exports.remove = function( event ) {

  if( this._$parent ) {
    delete this._$parent[this._$key]
  }

  //check if allready removed

  for( var key$ in this ) {
    if( this.hasOwnProperty( key$ ) ) {
      var property = this[key$]
      if( property instanceof Base ) {
        if(key$ !== '_$val') {
          property.remove( event )
        } else {
          console.error('remove _$val')
        }
      }  
      delete this[key$]
      //much rather null (perf)
    }
  }

  this._$val = null

  //what to return?

}

