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
      var myContext = bind._$context || null
      var myContextLevel = bind._$contextLevel || null
      bind._$context = contextBinds[i][1]
      bind._$contextLevel = contextBinds[i][2]

      if( bind._$contextLevel ) {
        var currContext = bind._$context
        var parent = bind._$parent
        //larger then zero since you dont need to set context on the context
        //clean this up by adding a method for this in context
        for(  var j = bind._$contextLevel-1; j>0 ; j-- ) {
          if(parent) {
             parent._$context = currContext
             parent._$contextLevel = j || null
             parent = parent._$parent
          }
        }
      }

      this.$execInternal( bind, event )
      bind._$context = myContext
      bind._$contextLevel = myContextLevel
    }

    if( this.$contextBinds ) {
      this.$contextBinds[stamp] = null
    }
  }

  if( binds ) {
    for( var i = 0, length = binds.length; i < length; i++ ) {

      //same here --- way too heavy
      binds[i].$resetContextsUp()
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
