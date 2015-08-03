"use strict";

var Event = require('../event')
var util = require('../util')

//split this function up in multiple
exports.$define = {
  $emit : function( type, event, meta, extraMeta ) {
    
    // console.log('emit on', this.$path)

    if( event === false ) {
      return
    }

    var emitter = this.$on && this.$on[ type ]

    if( emitter ) {

      if( event === void 0 ) {
        console.warn( 'force $emit from', this.$path, type )
        event = new Event( this )
      }

      if(!emitter.$noInstances) {
        var instances = this.$on._instances
        if( instances ) {
          for( var i = 0, instance, length = instances.length; i < length; i++ ) {
            instance = instances[i]
            if( instance !== this && instance !== this.__proto__ ) {
              instance.$emit.apply( instance, arguments )
            }
          }
        }
      }

      if( meta ) {
        //for perf
        if( extraMeta ) {
          var args = util.convertToArray( arguments )
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

    if( event && event.$postponed && !event.$block &&
        event.$origin === this
      ) {
      var postponed = event.$postponed
      var flags = this._$flags
      if( 
        flags &&
        ( !flags.$on.$base._$flags[type] || 
          flags.$on.$base._$flags[type].$base.$executePostponed !== false 
        )
      ) {
        // dit is die magic spot
        emitLoop(event)
        event.$postponed = null
      }
    }

    return event
  }
}

function emitLoop(event, p, metaPostponed, m) {
  var postponed = event.$postponed
  if(!p) {
    p = 0
  }
  for( var emitter$ ; (emitter$ = postponed[p]); p++ ) {
    if( emitter$.$meta ){
      if( !metaPostponed ) {
        metaPostponed = []
      }
      metaPostponed.push( emitter$ ) 
    }else{
      emitter$.$emit( event, void 0, true )
    }
  }

  var cachedLength = postponed.length

  if( metaPostponed ) {
    if( !m ) {
      m = 0
    }
    for( var meta$ ; (meta$ = metaPostponed[m]); m++ ) {
      meta$.$emit( event, void 0, true )
    }
  }

  if( cachedLength !== postponed.length ) {
    console.log( 'woah time for another loop u gaise!' )
    emitLoop( event, p, metaPostponed, m )
  }
}
