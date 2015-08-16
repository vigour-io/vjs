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

    //if allready defer && stamp === _$deferInProgress lstamp
    if(!this._$parent) {
      //this.$binds allready gaurds
      console.warn('emitter without parent: blocked!')
      return
    }
    this._$emitting = true

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

  this.$lastStamp = event.$stamp

  if( contextBinds ) {
    // var myContext
    //todo: double check the last stamp fix


    for( var i = 0, length = contextBinds.length; i < length; i++ ) {

      bind = contextBinds[i][0]

      //can be way way better...
      var myContext = bind._$context || null
      var myContextLevel = bind._$contextLevel || null
      var myContextKey =  bind._$contextKey || null

      // if(myContext) {
      //   console.log('called from context', myContext)
      // }

      bind._$context = contextBinds[i][1]
      bind._$contextLevel = contextBinds[i][2]
      bind._$contextKey = contextBinds[i][3]

      this.$execInternal( bind, event )


      bind._$context = myContext
      bind._$contextLevel = myContextLevel
      bind._$contextKey = myContextKey
    }

    if( this.$contextBinds ) {
      this.$contextBinds[stamp] = null
    }
  }

  //make function
  var binds = this.$binds && this.$binds[stamp]
  if( binds ) {

  //  console.log('doing binds')

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

  if(this._$emitting) {
    this._$emitting = null
  }

  this.$isPostponed = null
}
