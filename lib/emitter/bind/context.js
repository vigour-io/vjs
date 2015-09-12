var clone = require('lodash/lang/clone')

module.exports = function bindContextInternal( emitter, bind, event ) {

  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$contextBinds
  var context = bind._$context
  var level = bind._$contextLevel
  var contextChain
  var contextUp

  if(
    !binds || !isIncluded( binds[stamp], context )  //lookup context
  ) {

    if( !emitter.hasOwnProperty( '$contextBinds' ) ) {
      emitter.$contextBinds = binds = {}
    }

    if( !binds[stamp] ) {
      binds[stamp] = []
    }

    contextChain = [{
      context:context,
      level:level,
      bind:bind
    }]

    contextUp = context
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
    return true
  }
}

function contextUpCompare( context, contextStore ) {
  var contextUp = context
  var i = 0
  var same = 0
  while(contextUp) {
    if( contextStore[i] && contextStore[i].context === contextUp ) {
      same++
    }
    i++
    contextUp = contextUp._$context
  }
  return ( same===i )
}

function isIncluded( binds, context ) {
  if(!binds) {
    return;
  }
  for(var i in binds) {
    if(contextUpCompare( context, binds[i] )) {
      return true
    }
  }
}
