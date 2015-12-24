'use strict'
var Operator = require('./')
var isNumberLike = require('../util/is/numberlike')
var isNumber = require('../util/is/number')
var url = /^(((ws)|(http(s)?))\:\/\/)?[a-zA-Z0-9]+(\.|\:)([^\/\/])[a-zA-Z/0-9$-/:-?{-~!"^_`\[\]]+$/
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

// add time type

// add date type

// make all types injectables on the type operator -- cleaner

// split up -- add all utf-8 etc stuff as well
exports.inject = require('./val')
exports.properties = {
  $type: new Operator({
    key: '$type',
    properties: {
      range: true
    },
    operator (val, event, operator, origin) {
      var type = operator.val
      if (operator.range) {
        // make this for bytes and numbers
        // if buffer sets byte range
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
      } else if (type === 'buffer') {
        if (val instanceof Buffer) {
          return val
        } else if (
          typeof val === 'string' ||
          typeof val === 'boolean' ||
          isNumber(val)
        ) {
          if (val === true) {
            val = 1
          }
          return new Buffer(val)
        } else {
          // can also return an empty buffer
          return false
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
        // this is dirty! and unsececary
        let parsed = operator.parseValue(val, event, origin)
        if (parsed === 'string') {
          let type = typeof val
          // serialize observables to string for objects?
          if (type === parsed) {
            return val
          } else {
            if (val instanceof Buffer) {
              return val.toString('utf8')
            } else if (type === 'object' || val === false) {
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
