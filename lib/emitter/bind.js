"use strict";

var includes = require('../util/include').isIncluded

exports.$define = {
  $pushBind: function( bind, event ) {
    if( !bind ) {

      // console.warn('trying to bind "'+ bind + '" on emitter defaults to current Emitter')
      return bindInternal( this, this, event )

    } else if( bind._$context ) {
      return bindContextInternal( this, bind, event )
    } else {
      return bindInternal( this, bind, event )
    }
  },
  $postpone: function( bind, event ) {
    // console.log('%cpostpone it', 'color:orange;font-weight:bold;',
    // bind.$path, bind._$path)
    if( !event ) {
      throw new Error( '$postpone does not have event! (emitter)' )
      return
    }
    if( this.$pushBind( bind, event ) ) {
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

//clean this up
//TODO: needs perf optmizations!
function bindInternal( emitter, bind, event ) {
  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$binds
  var $emitterStamps = bind.$emitterStamps

  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
    !$emitterStamps[uid] ||
    !$emitterStamps[uid][stamp]
  ) {
    if( !emitter.hasOwnProperty( '$binds' ) ) {
      emitter.$binds = binds = {}
    }
    if( !binds[stamp] ) {
      binds[stamp] = []
    }
    binds[stamp].push( bind )
    if(
      !bind.hasOwnProperty( '$emitterStamps' )
    ) {
      bind.$emitterStamps = $emitterStamps = {}
      $emitterStamps[uid] = {}
    } else if( !$emitterStamps[uid] ) {
      $emitterStamps[uid] = {}
    }
    $emitterStamps[uid][stamp] = true
    return true
  }
}

function bindContextInternal( emitter, bind, event ) {

  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$contextBinds
  var $emitterStamps = bind.$emitterStamps
  var context = bind._$context

  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
    !$emitterStamps ||
    !$emitterStamps.$contexts ||
    !$emitterStamps.$contexts[uid] ||
    !$emitterStamps.$contexts[uid][stamp] ||
    !includes( $emitterStamps.$contexts[uid][stamp], context ) //lookup context
  ) {

    if( !emitter.hasOwnProperty( '$contextBinds' ) ) {
      emitter.$contextBinds = binds = {}
    }

    if( !binds[stamp] ) {
      binds[stamp] = []
    }

    binds[stamp].push([
      bind,
      bind._$context,
      bind._$contextLevel
    ])

    if(
      !bind.hasOwnProperty( '$emitterStamps' ) ||
      !$emitterStamps
    ) {
      bind.$emitterStamps = $emitterStamps = {
        $contexts: {}
      }
      $emitterStamps.$contexts[uid] = {}
    } else if(
      !$emitterStamps.$contexts
      || !$emitterStamps.$contexts[uid]
    ) {
      if( !$emitterStamps.$contexts ) {
        $emitterStamps.$contexts = {}
      }
      $emitterStamps.$contexts[uid] = {}
    }

    //this rly has te be cleaned now! -- remove the emitter caches
    if(!$emitterStamps.$contexts[uid][stamp]) {
      $emitterStamps.$contexts[uid][stamp] = []
    }
    $emitterStamps.$contexts[uid][stamp].push( bind._$context )

    return true
  }
}
