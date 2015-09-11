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

    // console.log(context)

    //context moet goed wordem gereset als het geset word

    var emitter = this.$on && this.$on[ type ]
    if( emitter ) {
      if( event === void 0 ) {
        event = new Event( this, type )
      }
      this.$emitInstances( emitter, event, context, arguments )
      if( !context ) {
        this.$clearContext()
      }
      // console.log('emit internal???')
      emitInternal( emitter, this, type, event,  meta, extraMeta, arguments )
    }
    this.$emitPostponed( type, event, context )
    return event
  },
  $emitPostponed: function( type, event, context ) {

    // if(event) {
    //   console.log('lezzgo2?', context, event && event.$context)
    // }

    //this is not yet clean --> event.$resolvedContext
    //check for ancestor as well?

    // if(event && event.$resolvedContext) {
    //   this.$clearContext()
    // }

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

      console.log(postponed) //this is wrong ofc

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
