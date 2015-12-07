'use strict'
var bindContextInternal = require('./context')
var bindInstances = require('./instances')

exports.define = {
  push (bind, event) {
    console.log('aaaa:', bind.path, bind._context)
    if (!bind) {
      return bindInstances(this, this, event)
    } else if (bind._context) {
      return bindContextInternal(this, bind, event)
    } else {
      return bindInstances(this, bind, event)
    }
  }
}
