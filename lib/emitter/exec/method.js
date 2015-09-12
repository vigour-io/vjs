"use strict";
module.exports = function exec( event ) {

  var stamp = this.$lastStamp = event.$stamp
  var contextBinds = this.$contextBinds && this.$contextBinds[stamp]
  var binds = this.$binds && this.$binds[stamp]
  var bind

  console.log(
    '%cexec - method:', 'color:brown;font-weight:bold;',
    '\n stamp:', event.$stamp,
    '\n contextBinds:', contextBinds,
    '\n binds:', binds
  )

  if( contextBinds ) {
    for( var i = contextBinds.length-1; i >= 0; i-- ) {

      bind = contextBinds[i][0].bind
      var stored = bind.$storeContext()
      var contextchain = bind

      for(var j in contextBinds[i]) {
        contextchain._$context = contextBinds[i][j].context
        contextchain._$contextLevel = contextBinds[i][j].level
        contextchain = contextchain._$context
      }

      this.$execInternal( bind, event )
      bind._$context = stored.context
      bind._$contextLevel = stored.level

      if(stored.context) {
        //TODO: ---> wrong restore exactemundo correct
        stored.context.$clearContextUp()
      }
      // ------------------------------------------
    }

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
