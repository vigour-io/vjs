'use strict'
var Operator = require('./')
var isNumberLike = require('../util/is/numberlike')
var isNumber = require('../util/is/number')
var url = /^(http(s?)\:\/\/)?[a-zA-Z0-9]+\.[a-zA-Z/0-9$-/:-?{-~!"^_`\[\]]+$/
var email = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,20}$/
var number = /(.*?)(-?\d+(\.\d+)?)/

function toFloat (val) {
  var match = val.match(number)
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
        let check = typeof val
        if (
          val &&
          (
            val === true ||
            check === 'string' ||
            isNumberLike(val) ||
            val instanceof Buffer
          )
        ) {
          return true
        } else {
          return false
        }
      } else if (type === 'url') {
        return url.test(val) ? val : false
      } else if (type === 'email') {
        return email.test(val) ? val : false
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
