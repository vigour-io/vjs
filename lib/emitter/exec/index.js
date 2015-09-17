"use strict";
var Base = require('../../base')
var shared = require( '../shared' )
var execattach = shared.execattach
var util = require('../../util')
var isRemoved = util.isRemove
var exec = require('./method.js')
var Event = require('../../event')

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
  fire: function( val, target, event ) {
    if( !target && this._$parent ) {
      target = this._$parent._$parent
    }
    if( !event ) {
      event = new Event( target, this.$key )
    }
    if( val ) {
      if( typeof val === 'function') {
        val.call( target, event, this._$meta )
      } else if( val instanceof Base ) {
        val.emit( this.$key, event )
      } else {
        execattach( val, target, event, this )
      }
    } else {
      this.$execInternal( target, event )
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
  $exec:function( event ) {
    if( this.$trigger ) {
      this.$trigger.$exec( event )
    } else {
      exec.call( this, event )
    }
  }
}
