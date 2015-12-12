'use strict'
describe('util test', function () {
  var perf = require('chai-performance')
  perf.debug = true
  chai.use(perf)
  // this is buggy shit
  var isNumberLike = require('../../../lib/util/is/numberlike')

  it('isNumberLike vs lodash isNumber', function (done) {
    this.timeout(50e3)
    var amount = 1e4
    var isNumber = require('lodash/lang/isNumber')

    expect(function () {
      for (var i = 0; i < amount; i++) {
        isNumberLike('a' + i)
      }
      for (i = 0; i < amount; i++) {
        isNumberLike(i)
      }
    }).performance({
      loop: 1e4,
      method () {
        for (var i = 0; i < amount; i++) {
          isNumber('a' + i)
        }
        for (i = 0; i < amount; i++) {
          isNumber(i)
        }
      }
    }, done)
  })
})
