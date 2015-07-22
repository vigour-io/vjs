"use strict";

var Event = require('../../event')
var util = require('../../util')

exports.$define = {
  $emit : function( type, event, meta ) {
    
    if( event === false ) {
      //double check if this check is nessecary
      console.warn('event is false do nothing in emit!', this.$path)
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
        for( var i = 0, instance, length = instances.length; i < length; i++ ) {
          instance = instances[i]
          if( instance !== this && instance !== this.__proto__ ) {
            instance.$emit.apply( instance, arguments )
          }
        }
      }

      if( meta ) {
        var args = util.convertToArray( arguments )
        args.unshift( event )
        args[1] = this
        args[2] = void 0
        emitter.$emit.apply( emitter, args )
      } else {
        emitter.$emit( event, this )
      }

    }

    if( 
      event && (!emitter || emitter.$executePostponed) && 
      event.$origin === this && !event.$block
    ) {
      var postponed = event.$postponed
      if( postponed ) {
        //this for can grow while executing thats why there is no length cache
        for( var i = 0, emitter$; (emitter$ = postponed[i]); i++ ) {
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

