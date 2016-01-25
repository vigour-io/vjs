'use strict'

describe('Observable', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  // require('./remove')
  // require('../set')
  require('./subscribe')
})
