'use strict'
var Base = require('../../base')
var Emitter = require('../../emitter')

module.exports = new Base({
  define: {
    ChildConstructor: Emitter,
    newParent: function (parent, event) {
      if (this.data && this.data.base) {
        parent.set({ on: { data: {} } }, false, true)
        parent._on.data.removeProperty(parent._on.data.base, 'base')
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
    remove: {
      val: new Emitter({
        triggerEvent: false
      }),
      override: 'removeEmitter'
    },
    new: new Emitter({
      emitInstances: false,
      emitContexts: false
    }),
    addToParent: new Emitter({
      emitInstances: false,
      emitContexts: false
    }),
    data: new Emitter()
  }
}).Constructor
