'use strict'

module.exports = function exec (event) {
  var stamp = this.lastStamp = event.stamp
  var contextBinds = this.contextBinds && this.contextBinds[stamp]
  var binds = this.binds && this.binds[stamp]
  var bind
  var i
  var length

  if (contextBinds) {
    var stored = contextBinds[0][0].bind.storeContextChain()
    length = contextBinds.length
    for (i = 0; i < length; i++) {
      bind = this.setContextChain(contextBinds[i])
      this.execInternal(bind, event)
    }
    contextBinds[0][0].bind.setContextChain(stored)
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
  if (this._meta) {
    this._meta = null
  }
  if (this._emitting) {
    this._emitting = null
  }
  this.isQueued = null
}
