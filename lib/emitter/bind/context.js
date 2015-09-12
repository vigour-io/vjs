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

function isAncestor( ancestor, child ) {
  var parent = child
  while(parent) {
    parent = parent._$parent
    console.log(ancestor._$path, parent && parent._$path)
    if( parent && parent._$Constructor && (ancestor === parent || ( ancestor instanceof parent._$Constructor ) )) {
      return true
    }
  }
}

function contextUpCompare( context, contextStore ) {
  console.group()
  var contextUp = context
  var i = 0
  var same = 0
  while(contextUp) {
    console.log(contextUp._$path, isAncestor(contextUp, contextStore[i].context))
    if( contextStore[i] && (contextStore[i].context === contextUp || isAncestor(contextUp, contextStore[i].context)) ) {
      same++
    }
    i++
    contextUp = contextUp._$context
  }

  console.log( same === i )
  console.groupEnd()

  return ( same === i )
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
