"use strict";

var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

define( proto, '$emit', {
  value:function( type, event, meta ) {
    
    var emitter = this.$on && this.$on[ type ]

    if( emitter ) {
      if(event === void 0) {
        console.warn('force $emit from', this.$path)
        event = new Event()
        event.$origin = this
      }
      console.error( type, event )
      if( meta ) {
        // console.log(meta) optimize this
        var args = Array.prototype.slice.call( arguments )
        console.log(args)
        args[0] = event
        args[1] = void 0
        emitter.$emit.apply( emitter, args )
      } else {
        emitter.$emit( event )
      }
    }

    if( event && ( !emitter || emitter.$executePostponed ) && event.$origin === this ) {
      console.error( type, event )
      //handle all the nested (postponed events)
      var postponed = event.$postponed
      if( postponed ) {
        //cannot use length postponed can grow while executing!
        for(var i = 0, emitter$;(emitter$ = postponed[i++]);) {
          emitter$.$emit( event, true )
        }
        event.$postponed = null
      }
    }

    return event
  },
  configurable:true
})

//defer goes here
