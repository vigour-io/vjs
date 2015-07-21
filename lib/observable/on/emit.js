"use strict";

var Event = require('../../event')
var util = require('../../util')

exports.$define = {
  $emit : function( type, event, meta ) {
    
    if( event === false ) {
      console.warn('event is false do nothing in emit!')
      return
    }

    var emitter = this.$on && this.$on[ type ]

    if( emitter ) {
      if( event === void 0 ) {
        console.warn( 'force $emit from', this.$path, type )
        event = new Event( this )
      }

      var instances = this.$on._instances

      if( instances ) {
        for( var i = 0, instance; (instance = instances[i++]); ) {
          if( instance !== this && instance !== this.__proto__ ) {
            instance.$emit.apply( instance, arguments )
          }
        }
      }

      if( meta ) {
        var args = util.convertToArray( arguments )
        args.unshift(event)
        args[1] = this
        args[2] = void 0
        emitter.$emit.apply( emitter, args )
      } else {
        emitter.$emit( event, this )
      }

    }

    if( 
      event && (!emitter || emitter.$executePostponed) && 
      event.$origin === this 
    ) {
      var postponed = event.$postponed
      if( postponed ) {
        for( var i = 0, emitter$; (emitter$ = postponed[i++]); ) {
          if( emitter$ ) {
            emitter$.$emit( event, emitter$._$parent._$parent, true )
          } 
        }
        event.$postponed = null
      }
    }

    return event
  }
}

