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
    on: {
      parent: function (data, event) {
        this.subscribe({
          upward: {
            title: true
          }
        }, function () {})
      },
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
