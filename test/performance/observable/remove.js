'use strict'

describe('Remove', function () {
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

  function nestedObservable () {
    arr = []
    for (var i = 0; i < amount; i++) {
      var a = new Observable({ //eslint-disable-line
        b: {}
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

  it('removing observables (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(function () {
      for (var i = 0; i < amount; i++) {
        arr[i].remove()
      }
    }).performance({
      loop: 10,
      time: 30,
      before: observable
    }, done)
  })

  it('creating nested observables (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(nestedObservable).performance({
      loop: 10,
      time: 30
    }, done)
  })

  it('removing nested observables (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(function () {
      for (var i = 0; i < amount; i++) {
        arr[i].remove()
      }
    }).performance({
      loop: 10,
      time: 100,
      before: nestedObservable
    }, done)
  })
})
