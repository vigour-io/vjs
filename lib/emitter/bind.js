"use strict";
// var includes = require('../util/include').isIncluded

exports.$define = {
  $pushBind: function( bind, event ) {
    if( !bind ) {
      return bindInternal( this, this, event )
    } else if( bind._$context ) {
      return bindContextInternal( this, bind, event )
    } else {
      return bindInternal( this, bind, event )
    }
  },
  $postpone: function( bind, event ) {
    if( !event ) {
      throw new Error( '$postpone does not have event! (emitter)' )
      return
    }
    if( this.$pushBind( bind, event ) ) {
      if(
        !this.hasOwnProperty( '$isPostponed' ) ||
        !this.$isPostponed
      ) {
        event.$postpone( this )
        //stamp? this is to generic im affraid
        //e.g. emitter is doing 2 things at the same time
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
  var emitterStamps = bind.$emitterStamps
  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
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
      !bind.hasOwnProperty( '$emitterStamps' )
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

function includes(arr, context, event) {
  for(var i in arr) {
    if(arr[i]===context) {
      return true
    }
  }
}

function bindContextInternal( emitter, bind, event ) {

  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$contextBinds
  var emitterStamps = bind.$emitterStamps
  var context = bind._$context
  var level = bind._$contextLevel

  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
    !emitterStamps ||
    !emitterStamps.$contexts ||
    !emitterStamps.$contexts[uid] ||
    !emitterStamps.$contexts[uid][stamp] ||
    //checken of de parent er is
    !includes( emitterStamps.$contexts[uid][stamp], context, event )  //lookup context
  ) {

    console.log('Bind context', context.$path,  context._$path)

    //NEED TO REMEBER CONTEXT CHAIN INSTEAD OF JUST ONE

    // console.log('---> add it:', context._$path)

    if( !emitter.hasOwnProperty( '$contextBinds' ) ) {
      emitter.$contextBinds = binds = {}
    }

    if( !binds[stamp] ) {
      binds[stamp] = []
    }

    var contextChain = {}
    // contextChain[bind._$contextLevel] = context

    var parent = context

    while(parent) {
      if(parent._$context) {
        contextChain[parent._$contextLevel] = parent._$context
      }
      parent = parent._$context
    }

    binds[stamp].push([
      bind,
      context,
      bind._$contextLevel,
      contextChain
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

    if(!emitterStamps.$contexts[uid][stamp]) {
      emitterStamps.$contexts[uid][stamp] = []
    }

    emitterStamps.$contexts[uid][stamp].push( bind._$context )

    return true
  }
}
