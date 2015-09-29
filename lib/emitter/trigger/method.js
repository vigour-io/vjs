'use strict'

module.exports = function execute (event) {
  var stamp = this.lastStamp = event.stamp
  var contextBinds = this.contextBinds && this.contextBinds[stamp]
  var binds = this.binds && this.binds[stamp]
  var bind, i, length

  if (contextBinds) {
    var first = contextBinds[0][0]
    var stored = first.bind.storeContextChain()
    length = contextBinds.length
    for (i = 0; i < length; i++) {
      bind = this.setContextChain(contextBinds[i])
      this.execInternal(bind, event)
    }
    first.bind.setContextChain(stored)
    if (this.contextBinds) {
      this.contextBinds[stamp] = null
    }
  }

  if (binds) {
    length = binds.length
    for (i = 0; i < length; i++) {
      binds[i].clearContextUp()
      this.execInternal(binds[i], event)
    }
    if (this.binds) {
      this.binds[stamp] = null
    }
  }

  if (this.data !== void 0) {
    delete this.data
  }

  this.isQueued = null
}
