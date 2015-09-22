'use strict'
var decodedLevel = require('./shared').decodedLevel

exports.$define = {
  $subscribeToProperty: function (property, val, key, event, refLevel, level, meta, map) {
    var value = val[key]
    if (value === true) {
      this.$addChangeListener(property, val, key, event, refLevel, level, meta, map)
      return true
    }
    if (typeof value === 'number') {
      if (decodedLevel(value) >= level) {
        this.$addChangeListener(property, val, key, event, refLevel, level, meta, map)
      }
      return true
    }
    return this.$loopSubsObject(property, value, event, refLevel, level, meta, map)
  }
}
