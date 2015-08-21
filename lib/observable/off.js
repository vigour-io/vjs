"use strict"
var Base = require('../base')
var Emitter = require('../emitter')
var util = require('../util')

exports.$define = {
 off: function( type, val, event ) {
    if( typeof type === 'string' ) {
      if( !val ) {
        val = 'val'
      }
      var emitter = this.$on && this.$on[type]
      if( emitter ) {
        emitter.off( val )
      }
    } else {
      findAndRemove( this, type, void 0, val )
    }
  }
}

function findAndRemove( base, val, emitter, key ) {
  if( !emitter ) {
    //TODO clean this up
    if( key ){
      for( var key$ in base.$on ) {
        if( base.$on[key$] instanceof Emitter ) {
          base.$on[key$].off( key )
        }
      }
    }else{
      for( var key$ in base.$on ) {
        if( base.$on[key$] instanceof Emitter ) {
          findAndRemove( base, val, base.$on[key$], key )
        }
      }
    }
  } else {
    emitter.off( val, key )
  }
}
