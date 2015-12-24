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
        this.triggerContext(bound, event, data, i)
      }
      if (bind) {
        bind.clearContextUp()
        this.execInternal(bind, event, data)
      }
      delete binds[i]
    }

    if (this.binds && isEmpty(this.binds[event.stamp])) {
      delete this.binds[event.stamp]
    }
  }
}
