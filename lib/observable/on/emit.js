"use strict";

var Event = require('../../event')
var util = require('../../util')

//DEFER STUFF MAKE IT!
exports.$define = {
  $emit : function( type, event, meta ) {
    var emitter = this.$on && this.$on[ type ]

    if( emitter ) {

      var instances = this.$on._instances

      if(instances) {
        //types moeten meekrijgen of het voor instances relevant is eigenlijk alleen voor change
        for(var i in instances) {
          if(instances[i]!==this && instances[i] !== this.__proto__) {
            // console.error('??????', instances[i], instances)
            instances[i].$emit.apply(instances[i], arguments)
          }
        }
      }

      if(event === void 0) {
        console.warn('force $emit from', this.$path, type)
        event = new Event()
        event.$origin = this
      }
      if( meta ) {
        // console.log(meta) optimize this
        var args = util.convertToArray( arguments )
        args[0] = event
        args[1] = void 0
        emitter.$emit.apply( emitter, args )
      } else {
        emitter.$emit( event )
      }
    }

    if( event && (!emitter || emitter.$executePostponed) && event.$origin === this ) {
      var postponed = event.$postponed
      if( postponed ) {
        for( var i = 0, emitter$; (emitter$ = postponed[i++]); ) {
          emitter$.$emit( event, true )
        }
        event.$postponed = null
      }
    }

    return event
  }
}

