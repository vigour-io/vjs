'use strict'
exports.inject = [
  require('./val'),
  require('./add')
]

exports.define = {
  Operator: require('./')
}

// here we can inject all operators (easy)
