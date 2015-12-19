'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')

exports.inject = require('./val')

exports.properties = {
  $transform: new Operator({
    key: '$transform',
    operator: function (val, operator, origin) {
      var parsed = operator.parseValue(val, origin)
      var cached = objectCache.call(this, parsed)
      if (cached) {
        // events etc to these sets!
        cached.clear()
        cached.set(parsed)
        // operator.clearContext()
        return cached
      } else {
        return parsed
      }
    }
  })
}
