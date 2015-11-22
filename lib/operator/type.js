'use strict'
var Operator = require('./')
var isNumberLike = require('../util/is/numberlike')
var isNumber = require('../util/is/number')

function toFloat (val) {
  var match = val.match(/(.*?)(-?\d+(\.\d+)?)/)
  return (match && match[2]) || 0
}

function getNumber (val) {
  if (isNumber(val)) {
    return val
  } else if (isNumberLike(val)) {
    return Number(val)
  } else if (typeof val === 'string') {
    return Number(toFloat(val) || 0)
  }
  return 0
}

exports.inject = require('./val')
exports.properties = {
  $type: new Operator({
    key: '$type',
    properties: {
      range: true
    },
    operator (val, operator, origin) {
      var type = operator.val
      if (operator.range) {
        let ranges = operator.range
        let min, max
        min = ranges[0]
        max = ranges[1]
        let numberVal = getNumber(val)
        if (numberVal >= min && numberVal <= max) {
          return numberVal
        } else {
          return (Math.abs(numberVal - max) < Math.abs(numberVal - min)) ? max : min
        }
      } else if (type === 'boolean') {
        return Boolean(val)
      } else {
        let parsed = operator.parseValue(val, origin)
        if (parsed === 'string') {
          let type = typeof val
          // serialize observables to string for objects?
          if (type === parsed) {
            return val
          } else {
            if (type === 'object' || val === false) {
              return ''
            }
            return val + ''
          }
        } else if (parsed === 'number') {
          return getNumber(val)
        }
      }
    }
  })
}
