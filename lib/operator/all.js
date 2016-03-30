'use strict'
exports.inject = [
  require('./add'),
  require('./transform')
]

// also inject emit -- we have to emit to parent on data
