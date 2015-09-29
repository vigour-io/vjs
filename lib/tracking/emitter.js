'use strict'
var Emitter = require('../emitter')
var Datalayer = require('./datalayer')

module.exports = new Emitter({
  properties: {
    services: function (val) {
      for (var i in val) {
        this.services[i] = val[i]
      }
    }
  },
  define: {
    services: { value: {} },
    emitterKeys: {
      value: {
        error: function (data, event, bind, key, id, dataLayer) {
          dataLayer.eventobject.metaMessage = data.message
        }
      }
    },
    parseInput: function (data, event, bind, key, ignore, id) {
      var dataLayer = new Datalayer({
        id: id,
        eventobject: {
          stamp: event.stamp,
          eventType: event.type,
          eventOriginator: event.origin.path[0]
        }
      })
      if (this.emitterKeys[key]) {
        this.emitterKeys[key].call(this, data, event, bind, key, id, dataLayer)
      }
      return dataLayer
    },
    emit: function () {
      var parsed = this.parseInput.apply(this, arguments)
      for (var service in this.services) {
        this.services[service](parsed)
      }
      Emitter.prototype.emit.apply(this, arguments)
    }
  }
})
