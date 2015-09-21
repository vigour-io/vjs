'use strict'
var bindContextInternal = require('./context')
var bindInstances = require('./instances')

exports.define = {
  bind: function (bind, event) {
    if (!bind) {
      return bindInstances(this, this, event)
    } else if (bind._context) {
      return bindContextInternal(this, bind, event)
    } else {
      return bindInstances(this, bind, event)
    }
  },
  push: function (bind, event) {
    if (this.bind(bind, event)) {
      if (
        !this.hasOwnProperty('isQueued') ||
        this.isQueued !== event.stamp
      ) {
        event.push(this)
        this.isQueued = event.stamp
      }
    }
  }
}
