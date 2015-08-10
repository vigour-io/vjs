"use strict";

//TODO: needs perf optmizations!
function bindInternal( emitter, bind, event ) {
  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$binds

  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
    !bind.$emitterStamps ||
    !bind.$emitterStamps[uid] ||
    !bind.$emitterStamps[uid][stamp]
  ) {

    if( !emitter.hasOwnProperty( '$binds' ) ) {
      emitter.$binds = binds = {}
    }

    if( !binds[stamp] ) {
      binds[stamp] = []
    }

    binds[stamp].push( bind )

    if(
      !bind.hasOwnProperty( '$emitterStamps' ) ||
      !bind.$emitterStamps
    ) {
      bind.$emitterStamps = {}
      bind.$emitterStamps[uid] = {}
    } else if(!bind.$emitterStamps[uid]) {
      bind.$emitterStamps[uid] = {}
    }

    //this rly has te be cleaned now!
    bind.$emitterStamps[uid][stamp] = true

    return true
  }
}

function bindContextInternal( emitter, bind, event ) {
  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$contextBinds

  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
    !bind.$emitterStamps ||
    !bind.$emitterStamps[uid] ||
    !bind.$emitterStamps[uid][stamp]
  ) {

    if( !emitter.hasOwnProperty( '$contextBinds' ) ) {
      emitter.$contextBinds = binds = {}
    }

    if( !binds[stamp] ) {
      binds[stamp] = []
    }

    // if( bind._$context ) {
    //   console.error( 'hey', bind.hasOwnProperty('_$instances'), bind.$path, bind._$context.$path )
    // }

    binds[stamp].push([
      bind,
      bind._$context,
      bind._$contextLevel,
      bind._$contextKey
    ])

    //hier ook context meepasen!
    if(
      !bind.hasOwnProperty( '$emitterStamps' ) ||
      !bind.$emitterStamps
    ) {
      bind.$emitterStamps = {}
      bind.$emitterStamps[uid] = {}
    } else if(!bind.$emitterStamps[uid]) {
      bind.$emitterStamps[uid] = {}
    }

    //this rly has te be cleaned now!
    bind.$emitterStamps[uid][stamp] = true

    return true
  }
}

exports.$define = {
  $pushBind: function( bind, event ) {
    console.log('push bind it', bind, bind.$path, bind._$context)
    if( !bind ) {
      throw new Error('trying to bind ""'+ bind + '" on emitter"')
    } else if( bind._$context ) {
      console.warn('new context lets resolve it!')
      return bindContextInternal( this, bind, event )
      // return bindContextInternal( this, bind, event )
    } else {
      console.log('bind?')
      return bindInternal( this, bind, event )
    }
  },
  $postpone: function( bind, event ) {
    if( !event ) {
      throw new Error( '$postpone does not have event! (emitter)' )
      return
    }
    if(
      this.$pushBind( bind, event )
    ) {
      if(
        //instances zijn special ofcourse
        !this.hasOwnProperty( '$isPostponed' ) ||
        !this.$isPostponed
      ) {
        event.$postpone( this )
        this.$isPostponed = true
      }
    }
  }
}
