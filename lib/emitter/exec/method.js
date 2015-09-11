"use strict";
module.exports = function exec( event ) {

  var stamp = this.$lastStamp = event.$stamp
  var contextBinds = this.$contextBinds && this.$contextBinds[stamp]
  var binds = this.$binds && this.$binds[stamp]
  var bind

  console.log(
    '%cexec - method:', 'color:brown',
    '\nstamp:', event.$stamp,
    '\ncontextBinds:', contextBinds,
    '\nbinds:', binds
  )

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
      //
      // if(bind._$contextLevel) {
      //   var j =  bind._$contextLevel
      //   var parent = bind._$parent
      //   console.log(j, bind._$contextLevel)
      //   while(parent && j) {
      //     console.log('???')
      //     parent._$contextLevel = j
      //     parent._$context = contextBinds[i][1]
      //     j--
      //     parent = parent._$parent
      //   }
      // }
      console.log( contextBinds[i][3] )

      console.log( 'contextBind loop:', bind.$path, bind._$context.$path )

      var contextChaining = bind._$context

      for(var level in contextBinds[i][3]) {
        console.log('?',level, contextBinds[i][3][level].$path)
        contextChaining = contextChaining._$context = contextBinds[i][3][level]
        contextChaining._$contextLevel = level
        console.log('?2',level, bind.$path)

        //voor multiple
      }

      this.$execInternal( bind, event )
      // ------------------------------------------
      //emit allready takes care of this?
      // bind.$clearContextUp()
      bind._$context = stored.context
      bind._$contextLevel = stored.level

      //do it up as well?

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
      console.log( 'bind loop:', binds[i].$path )

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
