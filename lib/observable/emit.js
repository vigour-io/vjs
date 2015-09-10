"use strict";
var Event = require('../event')
var util = require('../util')
var convertToArray = util.convertToArray

exports.$inject = [
  require( './instances'),
  require( './instances/emit' )
 ]

exports.$define = {
  emit : function( type, event, meta, extraMeta ) {
    if( event === false ) {
      return
    }
    var context = this._$context
    var emitter = this.$on && this.$on[ type ]
    if( emitter ) {
      if( event === void 0 ) {
        event = new Event( this, type )
      }
      this.$emitInstances( emitter, event, context, arguments )
      if( !context ) {
        this.$clearContext()
      }
      emitInternal( emitter, this, type, event,  meta, extraMeta, arguments )
    }
    this.$emitPostponed( type, event, context )
    return event
  },
  $emitPostponed: function( type, event, context ) {
    if( event
      && event.$type === type
      && ( event.$origin === this
          && event.$context == context //can be null or undefined as well
        )
      && !event.$block
    ) {
      var postponed = event.$postponed
      var flags = this._$flags
      if(
        postponed &&
        flags &&
        ( !flags.$on.$base._$flags[type] ||
          flags.$on.$base._$flags[type].$base.$postponed !== false
        )
      ) {
        event.loop()
      }
    }
  }
}

function emitInternal( emitter, base, type, event,  meta, extraMeta, args ) {
  if( meta ) {
    if( extraMeta ) {
      args = convertToArray( args )
      args.unshift( event )
      args[1] = this
      args[2] = void 0
      emitter.emit.apply( emitter, args )
    } else {
      emitter.emit( event, base, void 0, meta )
    }
  } else {
    emitter.emit( event, base )
  }
}
