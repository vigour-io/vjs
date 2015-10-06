'use strict'
var Operator = require('./')

exports.inject = require('./val')

exports.properties = {
  $transform: new Operator({
    key: '$transform',
    operator: function (val, operator, origin) {
      if (val instanceof Object) {
      }
      var parsed = operator.parseValue(val, origin)
      return parsed
    }
  })
}
