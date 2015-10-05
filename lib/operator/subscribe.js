'use strict'
var Operator = require('./')
// var SubsEmitter = require('../observable/subscribe/emitter')

exports.inject = [
  require('./val')
]
exports.properties = {
  $subscribe: new Operator({
    key: '$subscribe',
    order: -1,
    on: {
      parent: function (data, event) {},
      data: function (data, event) {
        // if (!this.subscribed) {
        //   this.subscribe({
        //     upward: {
        //       title: true
        //     }
        //   }, function () {})
        //   this.subscribed = true
        // }
      }
    },
    operator: function (val, operator, origin) {
      if (val instanceof Object) {} else {}
      // temp: very dirty
      // operator.subscribe(operator.convert({plain: true}), function () {})

      var parsed = operator.parseValue(val, origin)
      return parsed
    }
  })
}
