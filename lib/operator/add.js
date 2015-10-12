'use strict'
var Operator = require('./')
var cache = require('./cache/object')

exports.inject = require('./val')

exports.properties = {
  $add: new Operator({
    key: '$add',
    operator: function (val, operator, origin) {
      var parsed = operator.parseValue(val, origin)
      var cached = cache.call(this, parsed)
      if (cached) {
        cached.set(parsed)
        return cached
      } else {
        return val + parsed
      }
    }
  })
}
