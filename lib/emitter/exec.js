"use strict";
var Base = require('../base')
var shared = require( './shared' )
var execattach = shared.execattach
var exclude = shared.exclude

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
  console.log('exec')
  var contextBinds = this.$contextBinds && this.$contextBinds[event.$stamp]
  var bind

  console.log('1---!@#!@#?',contextBinds )

  if( contextBinds ) {
    // var myContext
    for( var i = 0, length = contextBinds.length; i < length; i++ ) {
      bind = contextBinds[i][0]
      console.log('do some contextBinds???',contextBinds[i][1],contextBinds[i][2],contextBinds[i][3] )
      bind._$context = contextBinds[i][1]
      bind._$contextLevel = contextBinds[i][2]
      bind._$contextKey = contextBinds[i][3]
      this.$execInternal( bind, event )

      bind.$clearContext()

    }
    this.$contextBinds[event.$stamp] = null
  }
  //make function
  var binds = this.$binds && this.$binds[event.$stamp]
  console.log('!@#!@#?', binds)
  if( binds ) {
    for( var i = 0, length = binds.length; i < length; i++ ) {
      console.log('dom some normal binds')
      this.$execInternal( binds[i], event )
    }
    this.$binds[event.$stamp] = null
  }


  // this.$lastStamp = event.$stamp

  //make function

  if(this._$meta) {
    this._$meta = null
  }

  this.$isPostponed = null
}
