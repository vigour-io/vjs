'use strict'
module.exports = function bindInstances (emitter, bind, event) {
  var stamp = event.stamp
  var binds = emitter.binds
  if (
    !binds || !isIncluded(binds[event.stamp], bind)
  ) {
    if (!emitter.hasOwnProperty('binds')) {
      emitter.binds = binds = {}
    }
    if (!binds[stamp]) {
      binds[stamp] = []
    }
    console.log('hey yo', bind.uid)

    binds[stamp].push(bind)
    return true
  }
}

function isIncluded (binds, bind) {
  if (!binds) {
    return
  }
  for (var i in binds) {
    // use uid this is slow!
    if (binds[i] === bind) {
      console.log('????')
      return true
    }
  }
}
