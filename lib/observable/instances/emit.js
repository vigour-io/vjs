"use strict";

exports.$define = {
  $emitInstances: function( emitter, event, args ) {
    if( emitter.$instances ) {
      var instances = this.hasOwnProperty( '_$instances' ) && this._$instances
      var instance
      if( instances && !this._$context ) {
        for( var i = 0, length = instances.length; i < length; i++ ) {
          instance = instances[i]
          instance.emit.apply( instance, args )
        }
      }
    }
  }
}
