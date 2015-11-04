'use strict'
var Operator = require('./')
var isNumberLike = require('../util/is/numberlike')
var isNumber = require('../util/is/number')

function toFloat (val) {
  var match = val.match(/(.*?)(-?\d+(\.\d+)?)/)
  return (match && match[2]) || 0
}

exports.inject = require('./val')
exports.properties = {
  $type: new Operator({
    key: '$type',
    operator (val, operator, origin) {
      let parsed = operator.parseValue(val, origin)
      if (parsed === 'string') {
        let type = typeof val
        // serialize observables to string for objects?
        if (type === parsed) {
          return val
        } else {
          if (type === 'object') {
            return ''
          }
          return val + ''
        }
      } else if (parsed === 'number') {
        if (isNumber(val)) {
          return val
        } else if (isNumberLike(val)) {
          return Number(val)
        } else if (typeof val === 'string') {
          return toFloat(val) || 0
        }
        return 0
      }
    }
  })
}
