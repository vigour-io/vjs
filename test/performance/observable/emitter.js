'use strict'

describe('Emitter', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Observable = require('../../../lib/observable')
  // var Event = require('../../../lib/event')
  var amount = 10000
  var arr

  function observable () {
    arr = []
    for (var i = 0; i < amount; i++) {
      var a = new Observable({ //eslint-disable-line
        val: function () {}
      })
      arr.push(a)
    }
  }

  function observableListener () {
    arr = []
    for (var i = 0; i < amount; i++) {
      var a = new Observable({ //eslint-disable-line
        on: { data: function () {} }
      })
      arr.push(a)
    }
  }

  it('creating observables (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(observable).performance({
      loop: 10,
      time: 15
    }, done)
  })

  it('creating observables with listeners (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(observableListener).performance({
      loop: 10,
      time: 60
    }, done)
  })

})
