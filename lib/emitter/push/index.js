'use strict'
var bindContextInternal = require('./context')
var bindInstances = require('./instances')

exports.define = {
  push: function (bind, event) {
    console.log('push!', bind && bind.uid, event.stamp)
    if (!bind) {
      return bindInstances(this, this, event)
    } else if (bind._context) {
      return bindContextInternal(this, bind, event)
    } else {
      console.log('2 - push!', bind && bind.uid, event.stamp)

      return bindInstances(this, bind, event)
    }
  }
}
