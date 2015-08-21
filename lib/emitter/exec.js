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
        property.emit( type, event )
      }, exclude, stamp )
    }

    if( emitter.$attach ) {
      emitter.$attach.each( function( property ) {
        execattach( property, bind, event, emitter )
      }, exclude, stamp )
    }
  },
  $exec:function( bind, event ) {

    // if(!this._$parent) {
    //   //prob removed does not make sense to update
    //   return
    // }
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

//once, is , promise (defers)

function exec( event ) {

  var stamp = this.$lastStamp = event.$stamp
  var contextBinds = this.$contextBinds && this.$contextBinds[stamp]
  var bind

  if( contextBinds ) {
    //TODO: double check the last stamp fix
    for( var i = contextBinds.length-1; i >= 0; i-- ) {
      bind = contextBinds[i][0]
      var myContext = bind._$context || null
      var myContextLevel = bind._$contextLevel || null
      bind._$context = contextBinds[i][1]
      bind._$contextLevel = contextBinds[i][2]

      if( bind._$contextLevel ) {
        var currContext = bind._$context
        var parent = bind._$parent
        //larger then zero since you dont need to set context on the context
        for(  var j = bind._$contextLevel-1; j>0 ; j-- ) {
          if(parent) {
             parent._$context = currContext
             parent._$contextLevel = j || null
             parent = parent._$parent
          }
        }
      }

      this.$execInternal( bind, event )
      bind._$context = myContext
      bind._$contextLevel = myContextLevel
    }

    if( this.$contextBinds ) {
      this.$contextBinds[stamp] = null
    }
  }

  var binds = this.$binds && this.$binds[stamp]
  console.log('??22?', this.$binds)

  if( binds ) {
    console.log('??2?')
    for( var i = 0, length = binds.length; i < length; i++ ) {
      binds[i].$resetContextsUp()
      this.$execInternal( binds[i], event )
    }
    if(this.$binds) {
      this.$binds[stamp] = null
    }
  }

  if(this._$meta) {
    this._$meta = null
  }
  this.$isPostponed = null
}
