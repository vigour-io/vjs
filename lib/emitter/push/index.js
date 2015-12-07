'use strict'
var bindContextInternal = require('./context')
var bindInstances = require('./instances')

exports.inject = require('./bind')

exports.define = {
  push: function (bind, event, data) {
    // reuse uid faster!
    // console.log('push!', bind && bind.uid, event.stamp)
    if (!bind) {
      return bindInstances(this, this, event, data)
    } else if (bind._context) {
      // double check how to do with context!
      return bindContextInternal(this, bind, event)
    } else {
      console.log('2 - push!', bind && bind.uid, event.stamp)
      return bindInstances(this, bind, event, data) // this has to be resued
    }
  }
}
