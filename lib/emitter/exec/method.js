"use strict";
module.exports = function exec( event ) {

  var stamp = this.$lastStamp = event.$stamp
  var contextBinds = this.$contextBinds && this.$contextBinds[stamp]
  var binds = this.$binds && this.$binds[stamp]
  var bind

  if( contextBinds ) {
    //TODO: double check the last stamp fix
    for( var i = contextBinds.length-1; i >= 0; i-- ) {
      bind = contextBinds[i][0]
      //------------------------------------------
      var stored = bind.$storeContext()
      //------------------------------------------
      bind._$context = contextBinds[i][1]
      bind._$contextLevel = contextBinds[i][2]
      //------------------------------------------
      this.$execInternal( bind, event )
      // ------------------------------------------
      //emit allready takes care of this?
      // bind.$clearContextUp()
      bind._$context = stored.context
      bind._$contextLevel = stored.level

      if(stored.context) {
        stored.context.$clearContextUp()
      }
      // bind.$restoreContext( false, false, true )
      // ------------------------------------------
    }

    if( this.$contextBinds ) {
      this.$contextBinds[stamp] = null
    }
  }

  if( binds ) {
    for( var i = 0, length = binds.length; i < length; i++ ) {
      //same here --- way too heavy
      binds[i].$clearContextUp()
      this.$execInternal( binds[i], event )
    }
    if(this.$binds) {
      //important add cleanup for emitterStamps object on bind
      this.$binds[stamp] = null
    }
  }

  if(this._$meta) {
    this._$meta = null
  }
  if(this._$emitting) {
    this._$emitting = null
  }

  this.$isPostponed = null
}
