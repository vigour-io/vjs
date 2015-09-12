"use strict";
var Event = require('../event')
var util = require('../util')
var convertToArray = util.convertToArray

exports.$inject = [
  require( './instances'),
  require( './instances/emit' ),
  require( './instances/context' ),
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

      this.$emitInstances( emitter, event, arguments )
      this.$emitContext( emitter, event, arguments )
      //shoud be resseted to what it was --- whole chain else this is too late and you lose the context
      this.$emitInternal( emitter, type, event,  meta, extraMeta, arguments )

      if( !context ) {
        this.$clearContext()
      }
    }
    this.$emitPostponed( type, event, context )
    return event
  },
  $emitPostponed: function( type, event, context ) {
    if( event
      && event.$type === type
      && ( ( event.$origin === this )
          && (event.$context == context  )
          //can be null or undefined as well
        )
      && !event.$block
    ) {
      console.error(' emit postponed ----->', this.$path.join('.'))
      var postponed = event.$postponed
      var flags = this._$flags

      console.log('postponed?', postponed) //this is wrong ofc

      if(
        postponed &&
        flags &&
        ( !flags.$on.$base._$flags[type] ||
          flags.$on.$base._$flags[type].$base.$postponed !== false
        )
      ) {
        console.error(' emit loop ----->', this.$path.join('.'))
        event.loop()
      }
    }
  },
  $emitInternal: function( emitter, type, event,  meta, extraMeta, args ) {
    if( meta ) {
      if( extraMeta ) {
        args = convertToArray( args )
        args.unshift( event )
        args[1] = this
        args[2] = void 0
        emitter.emit.apply( emitter, args )
      } else {
        emitter.emit( event, this, void 0, meta )
      }
    } else {
      console.error('-------- do this... -------', this.$path)
      emitter.emit( event, this )
    }
  }
}
