'use strict'
var Operator = require('./')
var Base = require('../base')
var objectCache = require('./cache/object')

exports.inject = require('./val')

exports.define = {
  origin: {
    get () {
      var reference = this.$origin || this
      while (reference._input instanceof Base) {
        reference = (reference.$origin || reference)._input
      }
      return reference
    }
  }
}

exports.properties = {
  $origin: new Operator({
    key: '$origin',
    operator (val, event, operator, origin) {
      var parsed = operator.parseValue(val, event, origin)
      var cached = objectCache.call(this, parsed)
      if (cached) {
        cached.filter(parsed, event)
        cached.set(parsed, event)
        return cached
      } else {
        return parsed
      }
    }
  }).Constructor
}
