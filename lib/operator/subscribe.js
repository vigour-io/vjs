'use strict'
var Operator = require('./')

exports.inject = [
  require('./val')
]
exports.properties = {
  $subscribe: new Operator({
    inject: require('../observable/subscribe'),
    key: '$subscribe',
    order: -1,
    operator: function (val, operator, origin) {
      if (val instanceof Object) {} else {}
      var parsed = operator.parseValue(val, origin)
      console.log('parsed', parsed)
      return parsed
    }
  })
}
