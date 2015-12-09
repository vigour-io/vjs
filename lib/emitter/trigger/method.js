'use strict'
var isEmpty = require('../../util/is/empty')
var isNumberLike = require('../../util/is/numberlike')

module.exports = function triggerInternal (event) {
  var binds = this.binds && this.binds[event.stamp]

  this.removeQueue(event)

  if (binds) {
    for (let i in binds) {

      console.warn('-- binds -->', event.stamp, '---', i, this.path)

      // console.warn('-- binds -->', i, this.path)

      let bound = binds[i]
      let data = bound.data
      let bind = bound.val

      if (bound.context) {
        execContext.call(this, bound, event, data)
        // this is the correct place
        // bound.context[0].bind.setContextChain(bound.context)
      }

      if (bind) {
        bind.clearContextUp()
        this.execInternal(bind, event, data)
        // removal is too fast for condition!
      }
      console.log('ok delete bind!', i)
      delete binds[i]
    }

    if (isEmpty(binds)) {
      delete this.binds
    }
  }
}

function execContext (bound, event, data) {
  for (let j in bound) {
    if (isNumberLike(j)) {
      if (bound[j].chain) {
        let bind = this.setContextChain(bound[j].chain)
        this.execInternal(bind, event, data)

        console.error('Remove context', this.path)

        delete bound[j].chain
      }
      execContext.call(this, bound[j], event, data)
    }
  }
}
