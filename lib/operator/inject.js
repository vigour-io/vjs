'use strict'
exports.inject = [
  require('./val'),
  require('./util'),
  require('./add')
]

exports.define = {
  Operator: require('./')
}

// here we can inject all operators (easy)
