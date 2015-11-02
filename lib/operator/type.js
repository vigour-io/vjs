'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')

exports.inject = require('./val')
exports.properties = {
  $type: new Operator({
    key: '$type',
    operator (val, operator, origin) {
      // make undefined return stop the process of operators! or somehting at least
      if (typeof operator._input === 'function') {
        // maybe do a contructor field?
        return  val instanceof operator._input ? val : void 0
      }
      let parsed = operator.parseValue(val, origin)
      if (parsed === 'string') {
        if (typeof val === parsed) {
          return val
        } else {
          if (typeof val === 'object') {
            return ''
          }
          return val + ''
        }
      }
    }
  })
}
