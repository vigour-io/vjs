'use strict'

exports.inject = require('../../methods/lookUp')

exports.properties = {
  trackInstances: true
}

exports.define = {
  instances: {
    get: function () {
      if (this.hasOwnProperty('_instances')) {
        return this._instances
      }
    }
  },
  addToInstances: function (event) {
    var proto = Object.getPrototypeOf(this)
    if (!proto.hasOwnProperty('_instances')) {
      proto._instances = []
    }
    proto._instances.push(this)
  },
  removeFromInstances: function (event) {
    var proto = Object.getPrototypeOf(this)
    var i, instances, length
    if (proto.hasOwnProperty('_instances')) {
      instances = proto._instances
      length = instances.length
      for (i = 0; i < length; i++) {
        if (instances[i] === this) {
          // removes itself from instances
          instances.splice(i, 1)
          break
        }
      }
    }
    instances = this.instances
    if (instances) {
      length = instances.length
      for (i = 0; i < length; i++) {
        // remove all own instance when removing instances
        instances[i].remove(event)
        i--
        length--
      }
    }
  }
}
