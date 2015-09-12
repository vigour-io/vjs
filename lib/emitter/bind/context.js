module.exports = function bindContextInternal( emitter, bind, event ) {

  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$contextBinds
  var emitterStamps = bind.$emitterStamps
  var context = bind._$context
  var level = bind._$contextLevel

  console.group()

  console.log('wtf checkkin!',
    bind._$path, bind.$path,
    emitter.$contextBinds,
    emitterStamps, stamp,
    emitterStamps && emitterStamps.$contexts,
    emitterStamps && emitterStamps.$contexts && emitterStamps.$contexts[uid]
  )

  if( emitterStamps && emitterStamps.$contexts) {
    for(var ux in emitterStamps.$contexts) {
      console.error(ux)
    }
  }

  if(
    !bind.hasOwnProperty( '$emitterStamps' ) ||
    !emitterStamps ||
    !emitterStamps.$contexts ||
    !emitterStamps.$contexts[uid] ||
    !emitterStamps.$contexts[uid][stamp] ||
    !includes( emitterStamps.$contexts[uid][stamp], context )  //lookup context
  ) {

    console.log('pass lets bind')

    if( !emitter.hasOwnProperty( '$contextBinds' ) ) {
      emitter.$contextBinds = binds = {}
      //this then has to copy
    }

    if( !binds[stamp] ) {
      binds[stamp] = []
    }

    var contextChain = [{
      context:context,
      level:level,
      bind:bind
    }]

    var contextUp = context
    while(contextUp) {
      if(contextUp._$context) {
        contextChain.push({
          context: contextUp._$context,
          level: contextUp._$contextLevel
        })
      }
      contextUp = contextUp._$context
    }

    binds[stamp].push(contextChain)

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

    //push different obj hier
    //namely the array then compare the first second etc

    //can we remove the emitterstamps all together and only use the binds object in emitter?
    emitterStamps.$contexts[uid][stamp].push( contextChain )

    return true
  }

  console.groupEnd()

}


function contextUpCompare( context, contextStore ) {
  var contextUp = context
  var i = 0
  var same = 0
  while(contextUp) {
    console.log('---->', contextUp[i], contextUp)

    if( contextStore[i] && contextStore[i].context === contextUp ) {
      console.log('---->', same, i)
      same++
    }
    i++
    contextUp = contextUp._$context
  }
  return ( same===i )
}

function includes( arr, context ) {
  console.log('im checkin')
  for(var i in arr) {
    if(contextUpCompare(context, arr[i])) {
      return true
    }
  }
}
