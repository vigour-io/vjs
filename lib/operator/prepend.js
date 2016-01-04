'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')

exports.inject = require('./val')

exports.properties = {
  $prepend: new Operator({
    key: '$prepend',
    operator (val, event, operator, origin) {
      var parsed = operator.parseValue(val, event, origin)
      var cached = objectCache.call(this, parsed)
      if (cached) {
        cached.set(parsed, event)
        return cached
      } else {
        // also use a cache!
        return parsed + val
      }
    }
  })
}
