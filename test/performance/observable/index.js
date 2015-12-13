'use strict'

describe('Observable', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Observable = require('../../../lib/observable')
  var amount = 1e3

  function observable () {
    var arr = []
    for (var i = 0; i < amount; i++) {
      var a = new Observable({ //eslint-disable-line
        val: function () {}
      })
      arr.push(a)
    }
  }

  function listenerObservable () {
    for (var i = 0; i < amount; i++) {
      var a = new Observable({ //eslint-disable-line
        on: { data: function () {} }
      })
    }
  }

  it('creating observables (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(observable).performance({
      loop: 10000,
      margin: 8,
      method: function () {
        var arr = []
        for (var i = 0; i < amount; i++) {
          var a = { //eslint-disable-line
            val: function () {}
          }
          arr.push(a)
        }
      }
    }, done)
  })

  it('removing observables (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(function () {
      for (var i = 0; i < amount; i++) {
        var a = new Observable()
        a.remove()
      }
    }).performance({
      loop: 1000,
      method: observable,
      margin: 2
    }, done)
  })

  it('creating observables with listeners (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(listenerObservable).performance({
      loop: 100,
      method: observable,
      margin: 5
    }, done)
  })

  it('creating observables with listeners, fire them (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(function () {
      for (var i = 0; i < amount; i++) {
        var a = new Observable({ //eslint-disable-line
          on: { data: function () {} }
        })
        a.val = i
      }
    }).performance({
      loop: 100,
      method: listenerObservable,
      margin: 2
    }, done)
  })
})
