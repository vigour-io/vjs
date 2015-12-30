'use strict'
var Operator = require('./')

exports.inject = require('./val')

exports.properties = {
  $prepend: new Operator({
    key: '$prepend',
    operator (val, event, operator, origin) {
      var parsed = operator.parseValue(val, event, origin)
      return parsed + val
    }
  })
}
