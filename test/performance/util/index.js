'use strict'
describe('util test', function () {
  var isNumberLike = require('../../../lib/util/is/numberlike')
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)

  it('isNumberLike vs lodash isNumber', function (done) {
    this.timeout(50e3)
    var amount = 1e3
    var isNumber = require('lodash/lang/isNumber')

    expect(function () {
      for (var i = 0; i < amount; i++) {
        isNumberLike('a' + i)
      }
      for (i = 0; i < amount; i++) {
        isNumberLike(i)
      }
    }).performance({
      loop: 1e3,
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
