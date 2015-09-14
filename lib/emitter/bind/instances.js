module.exports = function bindInstances( emitter, bind, event ) {
  var stamp = event.$stamp
  var binds = emitter.$binds
  if(
    !binds || !isIncluded(binds[event.$stamp], bind)
  ) {
    if( !emitter.hasOwnProperty( '$binds' ) ) {
      emitter.$binds = binds = {} 
    }
    if( !binds[stamp] ) {
      binds[stamp] = []
    }
    binds[stamp].push( bind )
    return true
  }
}

function isIncluded(binds, bind) {
  if(!binds) {
    return;
  }
  for(var i in binds) {
    if(binds[i] === bind) {
      return true
    }
  }
}
