"use strict";

var Base = require( '../base' )
var Event = require( '../event' )

var Emitter = module.exports = new Base({
  $inject: [
    require( '../base/uid' ),
    require( './storage' ),
    require( './defer' ),
    require( './exec' ),
    require( './bind' ),
    require( './off' ),
    require( './on' )
  ],
  $define: {
    $executePostponed: true,
    emit:function( event, bind, force, meta ) {
      console.error('>>>?')

      if( !event ) {
        console.warn('create new event from emitter.emit')
        event = new Event()
      } else if( !(event instanceof Event) ) {
        meta = event
        console.warn('event is not an instanceof event')
        event = new Event()
      }

      if( meta ) {
        this._$meta = meta
      }
      if( this.$lastStamp !== event.$stamp ) {
        if(  bind && (( !force  )
          && ( event.$type !== this.$key
              || event.$origin !== bind
              || event.$context !== bind._$context )
            )
          ) {

            this.$postpone( bind, event )
          } else if( !event.$block ) {
            console.error('????')

            if( bind || !force ) {
              this.$pushBind( bind, event )
            }
            this.$exec( bind, event )
          }
        }
      }
    }
  }).$Constructor
