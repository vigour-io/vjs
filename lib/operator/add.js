'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')

exports.inject = require('./val')

exports.properties = {
  $add: new Operator({
    key: '$add',
    operator (val, operator, origin) {
      var parsed = operator.parseValue(val, origin)
      var cached = objectCache.call(this, parsed)
      if (cached) {
        cached.set(parsed)
        return cached
      } else {
        // also use a cache!
        return val + parsed
      }
    }
  })
}
