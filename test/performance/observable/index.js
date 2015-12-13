'use strict'

describe('Observable', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Observable = require('../../../lib/observable')

  it('creating observables', function (done) {
    this.timeout(50e3)
    var amount = 1e3
    expect(function () {
      for (var i = 0; i < amount; i++) {
        var a = new Observable()
        a.val = i
      }
    }).performance({
      loop: 1000,
      time: 1
    }, done)
  })
})
