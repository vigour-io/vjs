"use strict";
var Base = require('../../base')
var shared = require( '../shared' )
var execattach = shared.execattach
var util = require('../../util')
var isRemoved = util.isRemove
var exec = require('./method.js')

exports.$define = {
  $exclude: function( property, key, base, stamp ) {
    var ignore = property._$ignoreStamp
    if( ignore ) {
      if( ignore === stamp ) {
        return true
      } else {
        property._$ignoreStamp = null
      }
    }
  },
  $execInternal: function( bind, event ) {
    var emitter = this
    var stamp = event.$stamp

    if( emitter.$fn ) {
      emitter.$fn.each( function( property, key ) {
        property.call( bind, event, emitter._$meta )
      }, emitter.$exclude, stamp )
    }

    if( emitter.$base ) {
      var type = emitter.$key
      emitter.$base.each( function( property ) {
        property.emit( type, event )
      }, emitter.$exclude, stamp )
    }

    if( emitter.$attach ) {
      emitter.$attach.each( function( property ) {
        execattach( property, bind, event, emitter )
      }, emitter.$exclude, stamp )
    }
  },
  $exec:function( bind, event ) {
    var defer = this.$defer
    if( defer ) {
      this.$defer.$exec( bind, event )
    } else {
      exec.call( this, event )
    }
  }
}
