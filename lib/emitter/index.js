"use strict";

var Base = require( '../base' )
var Event = require( '../event' )

var Emitter = module.exports = new Base({
  $inject: [
    require( './storage' ),
    require( './trigger' ),
    require( './exec' ),
    require( './bind' ),
    require( './off' ),
    require( './on' )
  ],
  $define: {
    $useVal: true,
    $postponed: true,
    $instances: true,
    $ignoreStamp: true,
    emit: function( event, bind, force, meta ) {

      if( !event ) {
        event = new Event( this )
      }

      if( meta ) {
        this._$meta = meta
      }

      if( this.$lastStamp !== event.$stamp || !this.hasOwnProperty('$lastStamp') ) {

        this._$emitting = true
        if(  bind && (( !force  )
        && ( event.$type !== this.$key
            || event.$origin !== bind
            || event.$context !== bind._$context )
          )
        ) {
          this.$postpone( bind, event )
        } else {
          if( bind || !force ) {
            this.$pushBind( bind, event )
          }
          if( !event.$block ) {
            this.$exec( event )
          }
        }
      }
    }
  }
}).$Constructor
