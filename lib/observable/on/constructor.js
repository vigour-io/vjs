'use strict'

var Base = require('../../base')
var Emitter = require('../../emitter')

module.exports = new Base({
  define: {
    ChildConstructor: Emitter,
    newParent: function (parent, event) {
      if (this.change && this.change.base) {
        parent.set({ on: { change: {} } }, false, true)
        parent._on.change.removeProperty(parent.on.change.base, 'base')
      }
    },
    generateConstructor: function () {
      return function On (val, event, parent, key) {
        if (parent) {
          parent.trackInstances = true
        }
        return Base.apply(this, arguments)
      }
    }
  },
  properties: {
    property: require('../../emitter/property'),
    error: require('../../emitter/error'),
    value: new Emitter({
      define: {
        executeQueue: false
      }
    }),
    reference: new Emitter({
      define: {
        executeQueue: false
      }
    }),
    new: new Emitter({
      define: {
        executeInstances: false
      }
    }),
    addToParent: new Emitter({
      define: {
        executeInstances: false
      }
    }),
    change: new Emitter()
  }
}).Constructor
