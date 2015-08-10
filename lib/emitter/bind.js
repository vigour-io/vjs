"use strict";

//TODO: needs perf optmizations!
function bindInternal( emitter, bind, event ) {
  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$binds
  var emitterStamps = bind.$emitterStamps

  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
    !emitterStamps ||
    !emitterStamps[uid] ||
    !emitterStamps[uid][stamp]
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
      !emitterStamps
    ) {
      bind.$emitterStamps = emitterStamps = {}
      emitterStamps[uid] = {}
    } else if( !emitterStamps[uid] ) {
      emitterStamps[uid] = {}
    }
    emitterStamps[uid][stamp] = true
    return true
  }
}

function includes( arr, val ) {
  for( var i = 0, length = arr.length; i < length; i++ ) {
    if( arr[i] === val ) {
      return true
    }
  }
}

function bindContextInternal( emitter, bind, event ) {

  console.log('tryxxxx!')

  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$contextBinds
  var emitterStamps = bind.$emitterStamps
  var context = bind._$context

  console.log('try!')

  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
    !emitterStamps ||
    !emitterStamps.$contexts ||
    !emitterStamps.$contexts[uid] ||
    !emitterStamps.$contexts[uid][stamp] ||
    !includes( emitterStamps.$contexts[uid][stamp], context ) //lookup context
  ) {

    console.log(1)

    if( !emitter.hasOwnProperty( '$contextBinds' ) ) {
      emitter.$contextBinds = binds = {}
    }

    console.log(2)


    if( !binds[stamp] ) {
      binds[stamp] = []
    }

    binds[stamp].push([
      bind,
      bind._$context,
      bind._$contextLevel,
      bind._$contextKey
    ])

    if(
      !bind.hasOwnProperty( '$emitterStamps' ) ||
      !emitterStamps
    ) {
      bind.$emitterStamps = emitterStamps = {
        $contexts: {}
      }
      emitterStamps.$contexts[uid] = {}
    } else if(
      !emitterStamps.$contexts
      || !emitterStamps.$contexts[uid]
    ) {
      if( !emitterStamps.$contexts ) {
        emitterStamps.$contexts = {}
      }
      emitterStamps.$contexts[uid] = {}
    }

    console.log(3)


    //this rly has te be cleaned now!
    if(!emitterStamps.$contexts[uid][stamp]) {
      emitterStamps.$contexts[uid][stamp] = []
    }
    emitterStamps.$contexts[uid][stamp].push( bind._$context )

    return true
  }
}

exports.$define = {
  $pushBind: function( bind, event ) {
    console.log('pushbind')
    if( !bind ) {
      throw new Error('trying to bind ""'+ bind + '" on emitter"')
    } else if( bind._$context ) {
      console.log('pushbind context')

      return bindContextInternal( this, bind, event )

      console.log('pushbind context done!')

    } else {
      console.log('pushbind context')

      var ret = bindInternal( this, bind, event )

      console.log('pushbind context done!')

      return ret

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