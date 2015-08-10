"use strict";
var Base = require('../base')
var shared = require( './shared' )
var execattach = shared.execattach
var exclude = shared.exclude

exports.$define = {
  $execInternal: function( bind, event ) {
    var emitter = this
    var stamp = event.$stamp

    emitter.$lastStamp = event.$stamp

    if( emitter.$fn ) {
      emitter.$fn.each( function( property, key ) {
        property.call( bind, event, emitter._$meta )
      }, exclude, stamp )
    }

    if( emitter.$base ) {
      var type = emitter.$key
      emitter.$base.each( function( property ) {
        property.$emit( type, event )
      }, exclude, stamp )
    }

    if( emitter.$attach ) {
      emitter.$attach.each( function( property ) {
        execattach( property, bind, event, emitter )
      }, exclude, stamp )
    }

    //this will make it unexpectedtly correct
    // bind.$emitterStamps = null

  },
  $exec:function( bind, event ) {

    //if allready defer && stamp === _$deferInProgress lstamp

    if(!this._$parent) {
      //this.__$bind__ allready gaurds
      // console.warn('emitter - no parent, i am probably removed!')
      return
    }

    var defer = this.$defer

    if( defer ) {
      if(!this.$deferInProgress) {

        //lets do some deferring

      } else {


      }
    } else {
      exec.call( this, event )
    }

  }
}

function exec( event ) {
  var binds = this.__$bind__ && this.__$bind__[event.$stamp]
  //bind will get stamp ids as well
  if( binds ) {
    for( var i = 0, length = binds.length; i < length; i++ ) {
      this.$execInternal( binds[i], event )
    }
    binds[event.$stamp] = null
    //if isEmpty remove __$bind__ ?

  }

  if(this._$meta) {
    this._$meta = null
  }

  this.$isPostponed = null
}
