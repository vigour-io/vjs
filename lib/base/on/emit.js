"use strict";

var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

//DEFER STUFF MAKE IT!

define( proto, '$emit', {
  value:function( type, event, meta ) {
    
    var emitter = this.$on && this.$on[ type ]

    if( emitter ) {
      if(event === void 0) {
        console.warn('force $emit from', this.$path, type)
        event = new Event()
        event.$origin = this
      }
      if( meta ) {
        // console.log(meta) optimize this
        var args = Array.prototype.slice.call( arguments )
        args[0] = event
        args[1] = void 0
        emitter.$emitEvent.apply( emitter, args )
      } else {
        emitter.$emitEvent( event )
      }
    }

    if( event && ( !emitter || emitter.$executePostponed ) && event.$origin === this ) {
      var postponed = event.$postponed
      if( postponed ) {
        for(var i = 0, emitter$;(emitter$ = postponed[i++]);) {
          emitter$.$emitEvent( event, true )
        }
        event.$postponed = null
      }
    }

    return event
  },
  configurable:true
})

