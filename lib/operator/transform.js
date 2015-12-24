'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')

exports.inject = require('./val')

exports.properties = {
  $transform: new Operator({
    key: '$transform',
    operator: function (val, event, operator, origin) {
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
  })
}
