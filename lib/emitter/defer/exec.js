"use strict";

var exec = require('../exec/method.js')

exports.$define = {
  $exec: function( bind, event ) {

    if( this.$inProgress ) {
      console.error('allready in progress!')
      return
    }

    this.$inProgress = {
      event: event,
      bind: bind
    }
    //now find a smart way to do this! --- make it possible to share defers if there is no difference!
    //also may need to do some stuff with input val etc

    console.error(bind,'?', this._$val)

    var emitter = this._$parent

    if( this._$val ) {
      this._$val.call( bind, function execEmitter() {
        // console.log('????', exec)
        emitter.$execInternal( bind, event )
      }, event, this )
    }

  }
}
