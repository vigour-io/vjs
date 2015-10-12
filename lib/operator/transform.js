'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')

exports.inject = require('./val')

exports.properties = {
  $transform: new Operator({
    key: '$transform',
    operator: function (val, operator, origin) {
      var parsed = operator.parseValue(val, origin)
      console.warn('---->', val, parsed)
      var cached = objectCache.call(this, parsed)
      if (cached) {
        // overwrite
        cached.set(parsed)
        return cached
      } else {
        return parsed
      }
    }
  })
}
