"use strict";
var bindContextInternal = require('./context')
var bindInstances = require('./instances')

exports.$define = {
  $pushBind: function( bind, event ) {
    if( !bind ) {
      return bindInstances( this, this, event )
    } else if( bind._$context ) {
      return bindContextInternal( this, bind, event )
    } else {
      return bindInstances( this, bind, event )
    }
  },
  $postpone: function( bind, event ) {
    if( this.$pushBind( bind, event ) ) {
      if(
        !this.hasOwnProperty( '$isPostponed' ) ||
        this.$isPostponed !== event.$stamp
      ) {
        event.$postpone( this )
        this.$isPostponed = event.$stamp
      }
    }
  }
}
