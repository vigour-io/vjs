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
        console.log(reference)
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
        cached.clear()
        cached.set(parsed)
        return cached
      } else {
        return parsed
      }
    }
  }).Constructor
}