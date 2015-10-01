'use strict'
var Operator = require('./')

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
