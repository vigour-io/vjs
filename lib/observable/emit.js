"use strict";

var Event = require('../event')
var util = require('../util')
var convertToArray = util.convertToArray

//split this function up in multiple
exports.$define = {
  $emit : function( type, event, meta, extraMeta ) {
    
    if( event === false ) {
      return
    }

    var emitter = this.$on && this.$on[ type ]

    if( emitter ) {

      if( event === void 0 ) {
        // console.warn( 'force $emit from', this.$path, type )
        event = new Event( this )
      }
      // TODO: uncomment this when not working on element
     

      //has to become optimized
      if(!emitter.$noInstances) {
        var instances = this.$on._instances
        if( instances && emitter.$instanceStamp !== event.$stamp ) {
          emitter.$instanceStamp = event.$stamp
          //this has to fix somehow...
          for( var i = 0, instance, length = instances.length; i < length; i++ ) {
            instance = instances[i]
            if( 
              instance !== this 
              && instance !== Object.getPrototypeOf(this) 
            ) {
              instance.$emit.apply( instance, arguments )
            }
          }
        }
      }

      if( meta ) {
        //for perf
        if( extraMeta ) {
          var args = convertToArray( arguments )
          args.unshift( event )
          args[1] = this
          args[2] = void 0
          emitter.$emit.apply( emitter, args )
        } else {
          emitter.$emit( event, this, void 0, meta )
        }
      } else {
        emitter.$emit( event, this )
      }
      
    }

    if( event && event.$origin === this && !event.$block ) {
      var postponed = event.$postponed
      var flags = this._$flags
      if( 
        postponed &&
        flags &&
        ( !flags.$on.$base._$flags[type] || 
          flags.$on.$base._$flags[type].$base.$executePostponed !== false 
        )
      ) {
        for( var i = 0, emitter$ ; (emitter$ = postponed[i]); i++ ) {
          emitter$.$emit( event, void 0, true )
        }
        event.$postponed = null
      }
    }

    return event
  }
}

