'use strict'
var Emitter = require('../emitter')
var Datalayer = require('./datalayer')

module.exports = new Emitter({
  properties: {
    services (val) {
      for (let i in val) {
        this.services[i] = val[i]
      }
    }
  },
  define: {
    services: { value: {} },
    emitterKeys: {
      value: {
        error (data, event, bind, key, ignore, dataLayer) {
          dataLayer.eventobject.metaMessage = data
        }
      }
    },
    parseInput (data, event, bind, key, ignore, id) {
      var dataLayer = new Datalayer({
        id: id,
        eventobject: {
          eventType: event.type,
          eventOriginator: event.origin.path[0],
          stamp: event.stamp
        }
      })
      if (data) {
        dataLayer.eventobject.value = data
      }
      if (this.emitterKeys[key]) {
        this.emitterKeys[key].call(this, data, event, bind, key, id, dataLayer)
      }
      return dataLayer
    },
    emit () {
      var parsed = this.parseInput.apply(this, arguments)
      for (var service in this.services) {
        this.services[service](parsed)
      }
      Emitter.prototype.emit.apply(this, arguments)
    }
  }
})
