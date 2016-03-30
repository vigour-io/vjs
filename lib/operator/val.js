'use strict'
var parseValue = require('../base').prototype.parseValue
// -----------------------------
exports.inject = [
  require('./util'),
  require('./cache')
]
// -----------------------------
exports.define = {
  parseValue: function (previousValue, origin, start, end) {
    var val = parseValue.call(this, previousValue, origin)
    if (start !== void 0 || end !== void 0) {
      return parseOperatorsRange.call(this, val, origin, start, end)
    } else {
      return parseOperatorsDefault.call(this, val, origin)
    }
  }
}

function parseOperatorsDefault (val, origin) {
  var operators = this.getOperators()
  if (operators) {
    for (let i in operators) {
      let operator = operators[i]
      resolveOperatorContext(operator, this)
      let bind = operator.getBind()
      if (bind) {
        val = operator._operator.call(bind, val, operator, origin)
      }
    }
  }
  return val
}

function parseOperatorsRange (val, origin, start, end) {
  var operators = this.getOperators()
  if (operators) {
    for (let i in operators) {
      let operator = operators[i]
      if (
        (end !== void 0 && operator._order > end) ||
        (start !== void 0 && operator._order < start)
      ) {
        continue
      }
      resolveOperatorContext(operator, this)
      let bind = operator.getBind()
      if (bind) {
        val = operator._operator.call(bind, val, operator, origin)
      }
    }
  }
  return val
}

function resolveOperatorContext (operator, parent) {
  if (operator._parent !== parent) {
    operator._context = parent
    operator._contextLevel = 1
  } else if (parent._context) {
    operator._context = parent._context
    operator._contextLevel = parent._contextLevel + 1
  }
}

// here we can inject all operators (easy)
