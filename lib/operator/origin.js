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
    operator (val, operator, origin) {
      var parsed = operator.parseValue(val, origin)
      var cached = objectCache.call(this, parsed)
      if (cached) {
        // events etc to these sets!
        cached.each(function (property, key) {
          if (!parsed[key] || parsed[key]._input === null) {
            property.remove()
          }
        })
        cached.set(parsed)
        // cached.clearContext()
        return cached
      } else {
        return parsed
      }
    }
  }).Constructor
}
