"use strict";

var Event = require('../../event')
var util = require('../../util')

//DEFER STUFF MAKE IT!
exports.$define = {
  $emit : function( type, event, meta ) {
    var emitter = this.$on && this.$on[ type ]

    if( emitter ) {

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
      // console.log(this.$path)
      if( instances ) {
        for( var i = 0, length = instances.length; i < length; i++ ) {
          if( instances[i]!==this && instances[i] !== this.__proto__ && instances[i] !== this) {
            // console.warn(this.$path, instances[i].$path, 'add instance for stamp', event.$stamp, instances[i].$path)
            instances[i].$emit.apply( instances[i], arguments )
          }
        }
      }

    }

    if( event && (!emitter || emitter.$executePostponed) && event.$origin === this ) {
      var postponed = event.$postponed
      if( postponed ) {
        // console.warn('exec postponed stamp', event.$stamp, this.$path)
        for( var i = 0, emitter$; (emitter$ = postponed[i++]); ) {
          //maybe allready store?

          //dit is nog iffy
          if(emitter$.$executePostponed) {
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

