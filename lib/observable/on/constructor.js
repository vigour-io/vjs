'use strict'
var Base = require('../../base')
var Emitter = require('../../emitter')

module.exports = new Base({
  define: {
    ChildConstructor: Emitter,
    newParent: function (parent, event) {
      if (this.change && this.change.base) {
        parent.set({ on: { change: {} } }, false, true)
        parent._on.change.removeProperty(parent._on.change.base, 'base')
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
      triggerEvent: false
    }),
    reference: new Emitter({
      triggerEvent: false
    }),
    new: new Emitter({
      emitInstances: false,
      emitContexts: false
    }),
    addToParent: new Emitter({
      emitInstances: false,
      emitContexts: false
    }),
    change: new Emitter()
  }
}).Constructor
