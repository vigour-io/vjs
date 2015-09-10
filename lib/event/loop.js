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
      // console.log('%cemit:', 'color:green;font-weight:bold;' , emitter$._$path)
      emitter$.emit( this, void 0, true )
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
      this.$postponed = null
    }
  }
}
