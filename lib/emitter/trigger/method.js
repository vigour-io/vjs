'use strict'

module.exports = function triggerInternal (event) {
  // console.log('go trigger', this._path, event.stamp)
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
    for (let i = 0, length = binds.length; i < length; i++) {
      binds[i].clearContextUp()
      this.execInternal(binds[i], event)
    }
  }

  // console.log('----> lets clear myself?', this._path, event.stamp)
  this.clear(event) // this clear is not good

  // lets solve data bind in a totally different way
  /*
    case:

    bla = {}
    // inheretis listener
    // now we do multiple fields
    // clear can happen before (event is not enough!)
   */
}
