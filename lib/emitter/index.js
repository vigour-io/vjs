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
    $ignoreStamp: true,
    emit: function( event, bind, force, meta ) {
      // console.group()
      // console.log('%cemitter.emit:', 'color:brown',
        // event.$stamp, bind && bind.$path && bind.$path.join('.')
      // )

      if( !event ) {
        console.warn('create new event from emitter.emit')
        event = new Event( this )
      }

      if( meta ) {
        this._$meta = meta
      }

      if( this.$lastStamp !== event.$stamp ) {
        this._$emitting = true
        //this may be too specific
        // console.log('%cemitter.emit:', 'color:brown',  ' -- 1 -- ')
        if(  bind && (( !force  )
        && ( event.$type !== this.$key
            || event.$origin !== bind
            || event.$context !== bind._$context )
          )
        ) {
          // console.log('%cemitter.emit:', 'color:brown',  ' -- 2 -- ')
          //hier komt pas echt een bind
          this.$postpone( bind, event )
        } else {
          // console.log('%cemitter.emit:', 'color:brown',  ' -- 3 -- ')

          if( bind || !force ) {
            //hier zit geen bind
            //warrom niet postpone???
            this.$pushBind( bind, event )
          }

          if( !event.$block ) {
            this.$exec( event )
          }
        }
      }

      // console.groupEnd()

    }
  }
}).$Constructor
