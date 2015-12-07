'use strict'

module.exports = function triggerInternal (event) {
  console.log('go trigger', this._path, event.stamp)
  // = this.lastStamp
  var stamp = event.stamp
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
    for (var i in binds) {
      // if(i !== 'context' ) do this later
      binds[i].val.clearContextUp()
      this.execInternal(binds[i].val, event)
    }
  }
}
