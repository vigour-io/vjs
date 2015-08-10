"use strict";
var Base = require('../base')
var shared = require( './shared' )
var execattach = shared.execattach
var exclude = shared.exclude
var util = require('../util')
var isRemoved = util.isRemove

exports.$define = {
  $execInternal: function( bind, event ) {
    var emitter = this
    var stamp = event.$stamp

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


    console.log( bind, this.$path )

    //if allready defer && stamp === _$deferInProgress lstamp
    if(!this._$parent) {
      //this.$binds allready gaurds
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
  //if isEmpty remove $binds ?
  var contextBinds = this.$contextBinds && this.$contextBinds[event.$stamp]
  var bind
  var stamp = event.$stamp

  if( contextBinds ) {
    // var myContext

    //todo: double check the last stamp fix

    for( var i = 0, length = contextBinds.length; i < length; i++ ) {
      bind = contextBinds[i][0]
      bind._$context = contextBinds[i][1]
      bind._$contextLevel = contextBinds[i][2]
      bind._$contextKey = contextBinds[i][3]
      this.$execInternal( bind, event )
      bind.$clearContext()
    }
    if( this.$contextBinds ) {
      this.$contextBinds[stamp] = null
    }
  }

  //make function
  var binds = this.$binds && this.$binds[stamp]
  if( binds ) {
    this.$lastStamp = event.$stamp

    for( var i = 0, length = binds.length; i < length; i++ ) {
      this.$execInternal( binds[i], event )
    }

    if(this.$binds) {
      //check this for removals
      this.$binds[stamp] = null
    }

  }

  //make function

  if(this._$meta) {
    this._$meta = null
  }

  this.$isPostponed = null
}
