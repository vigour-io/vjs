"use strict";

var Base = require( '../base' )

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
    $emit:function( event, bind, force, meta ) {
      if( meta ) {
        this._$meta = meta
      }

      if( this.$lastStamp !== event.$stamp ) {
        if( !force
          && ( event.$type !== this.$key
              || event.$origin !== bind
              || event.$context !== bind._$context
            )
          ) {
            this.$postpone( bind, event )
          } else if( !event.$block ) {
            if( bind ) {
              this.$pushBind( bind, event )
            }
            this.$exec( bind, event )
          }
        }
      }
    }
  }).$Constructor
