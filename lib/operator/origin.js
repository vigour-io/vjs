'use strict'
var Operator = require('./')
var Base = require('../base')

exports.inject = require('./val')

exports.define = {
  origin: {
    get () {
      var reference = this.$origin || this
      while (reference._input instanceof Base) {
        reference = (reference.$origin || reference)._input
      }
      return reference
    }
  }
}

exports.properties = {
  $origin: new Operator({
    key: '$origin',
    operator (val, event, operator, origin) {
      return operator.parseValue(val, event, origin)
    }
  }).Constructor
}
