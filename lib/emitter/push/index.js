'use strict'
var bindContextInternal = require('./context')
var bindInstances = require('./instances')

exports.inject = require('./bind')

exports.define = {
  push: function (bind, event, data) {
    if (!bind) {
      // non observable case
      // meer equal
      // return bindInstances(this, this, event, data)
    } else if (bind._context) {
      return bindContextInternal(this, bind, event, data)
    } else {
      return bindInstances(this, bind, event, data) // this has to be resued
    }
  }
}
