'use strict'
var Operator = require('./')

exports.inject = require('./val')

exports.properties = {
  $multiply: new Operator({
    key: '$multiply',
    operator: function (val, event, operator, origin) {
      var parsed = this.$multiply.parseValue(val, event, origin)
      return val * parsed
    }
  })
}
