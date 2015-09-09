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
    //rename executePostpone -- needs to be similair to noInstances
    //e.g. $instances: true , $postponed: true
    $useVal: true,
    $postponed: true,
    $instances: true,
    emit: function( event, bind, force, meta ) {

      if( !event ) {
        console.warn('create new event from emitter.emit')
        event = new Event()
      }

      if( meta ) {
        this._$meta = meta
      }

      if( this.$lastStamp !== event.$stamp ) {
        this._$emitting = true

        //this may be too specific
        if(  bind && (( !force  )
          && ( event.$type !== this.$key
              || event.$origin !== bind
              || event.$context !== bind._$context )
            )
          ) {
            this.$postpone( bind, event )
          } else if( !event.$block ) {
            if( bind || !force ) {
              this.$pushBind( bind, event )
            }
            this.$exec( bind, event )
          }
        }
      }
    }
  }).$Constructor
