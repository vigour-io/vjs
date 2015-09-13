module.exports = function eventLoop( p, metaPostponed, m ) {
  var postponed = this.$postponed
  if(!p) {
    p = 0
  }
  for( var emitter$ ; (emitter$ = postponed[p]); p++ ) {
    if( emitter$.$meta ){
      if( !metaPostponed ) {
        metaPostponed = []
      }
      metaPostponed.push( emitter$ )
    } else{
      emitter$.emit( this, void 0, true )
      emitter$.$isPostponed = null
    }
  }

  if( metaPostponed ) {
    var cachedLength = postponed.length
    if( !m ) {
      m = 0
    }
    for( var meta$ ; (meta$ = metaPostponed[m]); m++ ) {
      meta$.emit( this, void 0, true )
    }
    if( cachedLength !== postponed.length ) {
      emitLoop( p, metaPostponed, m )
    } else {
      this.clear()
    }
  }
}
