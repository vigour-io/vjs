'use strict'
var isEmpty = require('../../util/is/empty')

module.exports = function triggerInternal (event) {
  var binds = this.binds && this.binds[event.stamp]

  if (binds) {
    for (let i in binds) {
      let bound = binds[i]
      let data = bound.data
      let bind = bound.val

      if (bound.context) {
        execContext.call(this, bound, event, data)
        bound.context[0].bind.setContextChain(bound.context)
      }

      if (bind) {
        bind.clearContextUp()
        this.execInternal(bind, event, data)
        // removal is too fast for condition!
      }

      delete binds[i]
    }

    if (isEmpty(binds)) {
      delete this.binds
    }
  }
}

function execContext (bound, event, data) {
  for (let j in bound) {
    // this needs cleaning of course (check char range index)
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
