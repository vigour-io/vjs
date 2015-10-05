'use strict'
var Operator = require('./')
var Observable = require('../observable')

exports.inject = [
  require('./val')
]
exports.properties = {
  $subscribe: new Operator({
    inject: require('../observable/subscribe'),
    key: '$subscribe',
    order: -1,
    on: {
      data: function () {
        // TODO don't use convert!
        this.subscribe(this.$subscribe.convert({plain: true}), function () {
          console.log('??', arguments)
          this.$subscribe.output = 'nerdje'
        })
      }
    },
    operator: function (val, operator, origin) {
      if (val instanceof Object) {
      } else {
      }
      // temp: very dirty
      // operator.subscribe(operator.convert({plain: true}), function () {})

      var parsed = operator.parseValue(val, origin)
      return parsed
    }
  })
}
