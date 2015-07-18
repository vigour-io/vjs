"use strict";

var Event = require('../../event')
var util = require('../../util')

//DEFER STUFF MAKE IT!
exports.$define = {
  $emit : function( type, event, meta ) {
    
    var emitter = this.$on && this.$on[ type ]
    if( emitter ) {
      //too many variables, too much hoisting make seperate function
      if( event === void 0 ) {
        console.warn('force $emit from', this.$path, type)
        event = new Event()
        event.$origin = this
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

      var instances = this.$on._instances

      if( instances ) {
        for( var i = 0, instance; (instance = instances[i++]); ) {
          if( instance !== this && instance !== this.__proto__ ) {
            instance.$emit.apply( instance, arguments )
          }
        }
      }

    }

    if( 
      event && (!emitter || emitter.$executePostponed) && event.$origin === this ) {
      //too many variables, too much hoisting make seperate function
      var postponed = event.$postponed
      if( postponed ) {
        // console.warn('exec postponed stamp', event.$stamp, this.$path)
        for( var i = 0, emitter$; (emitter$ = postponed[i++]); ) {
          if( emitter$.$executePostponed ) {
            emitter$.$emit( event, emitter$._$parent._$parent, true )
          } else {
            emitter$.$emit( event, emitter$.$parent.$parent, true )
          }
        }
        event.$postponed = null
      }
    }

    return event
  }
}

