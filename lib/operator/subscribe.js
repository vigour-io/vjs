'use strict'
var Operator = require('./')

exports.inject = [
  require('./val')
]
exports.properties = {
  $subscribe: new Operator({
    key: '$subscribe',
    define: {
      set: function (pattern) {
        if (typeof pattern === 'string') {
          var keys = pattern.split('.')
          var value = true
          for (var i = keys.length - 1; i >= 0; i--) {
            pattern = {}
            pattern[keys[i]] = value
            value = pattern
          }
        }
        this._parent.subscribe(pattern, [ function (data, event, $subscribe) {
          $subscribe.output = data.origin
        }, this])
      }
    },
    operator: function (val, operator, origin) {
      if (val instanceof Object) {} else {}
      var parsed = operator.parseValue(val, origin)
      return parsed
    }
  })
}
