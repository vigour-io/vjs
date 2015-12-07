'use strict'

module.exports = function triggerInternal (event) {
  // = this.lastStamp
  var stamp = event.stamp
  // var contextBinds = this.contextBinds && this.contextBinds[stamp]
  var binds = this.binds && this.binds[stamp]
  var isEmpty = require('../../util/is/empty')

  if (binds) {
    for (let i in binds) {
      let bound = binds[i]
      let data = bound.data
      if (bound.context) {
        execContext.call(this, bound, event, data)
        bound.context[0].bind.setContextChain(bound.context)
      }
      if (!bound.val) {
        delete binds[i]
      }
    }

    for (let i in binds) {
      let bound = binds[i]
      let data = bound.data
      let bind = bound.val
      if (bind) {
        bind.clearContextUp()
        this.execInternal(bind, event, data)
        delete binds[i]
      }
    }

    if (isEmpty(binds)) {
      delete this.binds
    }
  }
}

function execContext (bound, event, data) {
  for (let j in bound) {
    if (j !== 'data' && j !== 'val' && j !== 'context' && j !== 'chain') {
      if (bound[j].chain) {
        let bind = this.setContextChain(bound[j].chain)
        this.execInternal(bind, event, data)
        delete bound[j].chain
      }
      execContext.call(this, bound[j], event, data)
    }
  }
}
