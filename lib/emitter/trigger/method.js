'use strict'

module.exports = function execute (event) {

  var stamp = this.lastStamp = event.stamp
  var contextBinds = this.contextBinds && this.contextBinds[stamp]
  var binds = this.binds && this.binds[stamp]
  var bind, i, length

  console.log('%cEmit it exec', 'color:purple', contextBinds, binds)

  if (contextBinds) {
    // nested vars can become lets in es6
    var first = contextBinds[0][0]
    var stored = first.bind.storeContextChain()
    length = contextBinds.length
    for (i = 0; i < length; i++) {
      bind = this.setContextChain(contextBinds[i])
      this.execInternal(bind, event)
    }
    console.error('c-trigger', contextBinds[i])

    first.bind.setContextChain(stored)
    if (this.contextBinds) {
      this.contextBinds[stamp] = null
    }
  }

  if (binds) {
    length = binds.length
    for (i = 0; i < length; i++) {
      console.error('trigger', binds[i]._path)
      binds[i].clearContextUp()
      this.execInternal(binds[i], event)
    }
    if (this.binds) {
      this.binds[stamp] = null
    }
  }

  if (this.meta !== void 0) {
    delete this.meta
    // = null
  }

  this.isQueued = null
}
