'use strict'
var isEmpty = require('../../util/is/empty')
global.cnt = 0
module.exports = function triggerInternal (event) {
  global.cnt++
  var binds = this.binds && this.binds[event.stamp]
  this.removeQueue(event)

  if (binds) {
    for (let i in binds) {
      let bound = binds[i]
      let data = bound.data
      let bind = bound.val

      if (bound.context) {
        this.triggerContext(bound, event, data, i)
      }

      if (bind) {
        bind.clearContextUp()
        this.execInternal(bind, event, data)
      }

      // if (bound.context) {
      //   bound.context[0].bind.setContextChain(bound.context)
      // }
      delete binds[i]
    }
    // console.log(event.stamp, this.bind, this.binds && isEmpty(this.binds), binds)
    if (this.binds && isEmpty(this.binds)) {
      delete this.binds[event.stamp]
    }
  }
}
