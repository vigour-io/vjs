var clone = require('lodash/lang/clone')

module.exports = function bindContextInternal( emitter, bind, event ) {

  var stamp = event.$stamp
  var uid = emitter.$uid
  var binds = emitter.$contextBinds
  var context = bind._$context
  var level = bind._$contextLevel

  console.error('lets go!', bind.$path )

  if( !binds || !isIncluded( binds[stamp], context ) ) {

    if( !emitter.hasOwnProperty( '$contextBinds' ) ) {
      emitter.$contextBinds = binds = {}
    }

    if( !binds[stamp] ) {
      binds[stamp] = []
    }

    binds[stamp].push( bind.$storeContextChain() )
    return true
  }
}

function isAncestor( ancestor, child ) {
  var parent = child
  while(parent) {
    parent = parent._$parent
    if( parent && parent._$Constructor && (ancestor === parent || ( ancestor instanceof parent._$Constructor ) )) {
      console.log('--->',ancestor._$path, parent && parent._$path)
      return true
    }
  }
}

function contextUpCompare( context, contextStore ) {
  console.group()

  console.log('compare this biatch', context._$path, context.$path )

  var contextUp = context
  var i = 0
  var same = 0
  var ignoreLength
  while(contextUp) {
    // console.log( contextUp._$path, contextStore[i].context._$path, contextStore.length )
    if( contextStore[i]) {
      if( contextStore[i].context === contextUp ) {
        same++
      } else if(isAncestor(contextUp, contextStore[i].context)) {
        same++
        // same = same + 1
        //dit kan niet goed zijn!!!
        ignoreLength = true
      }
    }
    i++
    contextUp = contextUp._$context
  }

  console.log( contextStore.length === i && same === i )
  console.groupEnd()

  return ( (ignoreLength || contextStore.length === i) && same === i )
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
