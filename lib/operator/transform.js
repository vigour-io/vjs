'use strict'
var Operator = require('./')

exports.inject = require('./val')

exports.properties = {
  $transform: new Operator({
    key: '$transform',
    operator: function (val, operator, origin) {
      var parsed = operator.parseValue(val, origin)
      console.warn('---->', val, parsed)
      return parsed
    }
  })
}
