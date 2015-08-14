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

  //emitterlastmap
  this.$lastStamp = stamp

  if( contextBinds ) {
    // var myContext
    //todo: double check the last stamp fix
    // console.log(contextBinds)

    for( var i = contextBinds.length-1; i >= 0; i-- ) {

      bind = contextBinds[i][0]

      //original can both be a context one or a normal one
      //treat more the same clean up!!!

      // can be way way better...
      var myContext = bind._$context || null
      var myContextLevel = bind._$contextLevel || null


      bind._$context = contextBinds[i][1]
      bind._$contextLevel = contextBinds[i][2]
      // bind._$contextKey = contextBinds[i][3]

      // console.log('%cgoing to do .$resetContextsPath', 'padding:4px; background: #ccc; color: blue',

      //have to reset to top!

      var tpath = bind.$path
      console.log('\n')
      console.log('%cexecute emitter - context', 'padding:4px; background: #333; color: orange'
        , '\n\n emitter-type:', this.$key
        , '\n contex path:', bind._$context.$path
        , '\n bind-context-path:', tpath
      )

       //right here!!!!

       //something just goes wrong when resetting context there

       //THE NOT CONTEXTLVL CHECK IS NONSENSE
      if( bind._$contextLevel ) { //this && !myContextLevel fixes the test but bad need to put it back..
        //make a method for this!

        var currContext = bind._$context
        var parent = bind._$parent
        //larger then zero since you dont need to set context on the context
        for(  var j = bind._$contextLevel-1; j>0 ; j-- ) {
          console.log('%cVERY STRANGE - bind-context-path:', 'padding:1px; background: #333; color: orange')

          if(parent) {
             parent._$context = currContext
             parent._$contextLevel = j || null
             parent = parent._$parent
          }
        }
        console.log('%cresolved - bind-context-path:', 'padding:1px; background: #333; color: orange'
         , '\n\n ', bind.$path
         , '\n', 'from: ', tpath
        )
      }

      this.$execInternal( bind, event )

      bind._$context = myContext
      bind._$contextLevel = myContextLevel

      // some logic here clean up whole path?
      // bind._$contextKey = myContextKey

    }

    if( this.$contextBinds ) {
      this.$contextBinds[stamp] = null
    }
  }

  //make function
  var binds = this.$binds && this.$binds[stamp]
  if( binds ) {

    //original can both be a context one or a normal one
    for( var i = 0, length = binds.length; i < length; i++ ) {
      console.log('\n')
      //this is mos def not always a good thing to do... will break stuff!

      console.log('%cexecute emitter and clear contextsup --$temp ', 'padding:4px; background: #333; color: orange'
        , '\n\n emitter-type:', this.$key
        , '\n bind-path:', binds[i].$path
      )
      binds[i].$resetContextsUp()

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
