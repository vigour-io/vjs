"use strict";
module.exports = function exec( event ) {
  var stamp = this.$lastStamp = event.$stamp
  var contextBinds = this.$contextBinds && this.$contextBinds[stamp]
  var binds = this.$binds && this.$binds[stamp]
  var bind
  if( contextBinds ) {
    var stored = contextBinds[0][0].bind.$storeContextChain()
    for( var i = 0, length = contextBinds.length; i < length; i++ ) {
      var bind = this.$setContextChain(contextBinds[i])
      this.$execInternal( bind, event )
    }
    contextBinds[0][0].bind.$setContextChain(stored)
    if( this.$contextBinds ) {
      this.$contextBinds[stamp] = null
    }
  }
  if( binds ) {
    for( var i = 0, length = binds.length; i < length; i++ ) {
      binds[i].$clearContextUp()
      this.$execInternal( binds[i], event )
    }
    if(this.$binds) {
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
