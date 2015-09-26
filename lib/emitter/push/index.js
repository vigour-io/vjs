'use strict'
var bindContextInternal = require('./context')
var bindInstances = require('./instances')

exports.define = {
  push: function (bind, event) {
    if (!bind) {
      return bindInstances(this, this, event)
    } else if (bind._context) {
      return bindContextInternal(this, bind, event)
    } else {
      return bindInstances(this, bind, event)
    }
  }
}
