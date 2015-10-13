'use strict'

module.exports = function triggerInternal (event) {
  var stamp = this.lastStamp = event.stamp
  var contextBinds = this.contextBinds && this.contextBinds[stamp]
  var binds = this.binds && this.binds[stamp]

  if (contextBinds) {
    let first = contextBinds.first
    let bind
    delete contextBinds.first
    for (let i in contextBinds) {
      bind = this.setContextChain(contextBinds[i])
      this.execInternal(bind, event)
    }
    first[0].bind.setContextChain(first)
  }

  if (binds) {
    for (let i = 0, length = binds.length; i < length; i++) {
      binds[i].clearContextUp()
      this.execInternal(binds[i], event)
    }
  }

  this.clear(event)
}
