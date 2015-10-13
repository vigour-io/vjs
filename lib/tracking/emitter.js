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
        error (data, event, bind, key, id, dataLayer) {
          dataLayer.eventobject.metaMessage = data.message
        }
      }
    },
    parseInput (data, event, bind, key, ignore, id) {
      console.log('parse!', key)
      var dataLayer = new Datalayer({
        id: id,
        name: key,
        eventobject: {
          eventType: event.type,
          eventOriginator: event.origin.path[0],
          stamp: event.stamp
        }
      })
      if (this.emitterKeys[key]) {
        this.emitterKeys[key].call(this, data, event, bind, key, id, dataLayer)
      }
      if (data && event.type != 'error') {
        dataLayer.eventobject.value = data
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
