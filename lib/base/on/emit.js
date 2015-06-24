"use strict";

var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

define( proto, '$emit', {
  value:function( type, event ) {
    
    if( this.$on && this.$on[ type ] ) {
      if(event === void 0) {
        console.warn('force $update from', this.$path)
        event = new Event()
        event.$origin = this
      }
      this.$on[type].$emit( event )
    }

    if( event && event.$origin === this ) {
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
