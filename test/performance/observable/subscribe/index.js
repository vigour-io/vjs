'use strict'

describe('Subscribe', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Observable = require('../../../../lib/observable')
  // var Event = require('../../../lib/event')
  var amount = 1000
  var arr

  function observable () {
    arr = []
    for (var i = 0; i < amount; i++) {
      var a = new Observable({ //eslint-disable-line
        b: true
      })
      a.subscribe({
        b: true
      })
      arr.push(a)
    }
  }

  it('creating observables add listeners and fire on existing field (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(function () {
      arr = []
      for (var i = 0; i < amount; i++) {
        var a = new Observable({ //eslint-disable-line
          b: true,
          on: {
            data () {

            }
          }
        })
        a.val = i
        arr.push(a)
      }
    }).performance({
      loop: 10,
      time: 100
    }, done)
  })

  it('creating observables add listeners using context (' + amount + ')', function (done) {
    this.timeout(50e3)
    var thing = new Observable({
      b: true,
      on: { data () {} }
    })
    var Thing = thing.Constructor
    expect(function () {
      arr = []
      for (var i = 0; i < amount; i++) {
        var a = new Thing({
          val: i
        })
        arr.push(a)
      }
    }).performance({
      loop: 10,
      time: 100
    }, done)
  })

  it('creating observables and subscribing on existing field (' + amount + ')', function (done) {
    this.timeout(50e3)
    expect(observable).performance({
      loop: 10,
      time: 100
    }, done)
  })

  it('creating observables subscribing using context (' + amount + ')', function (done) {
    this.timeout(50e3)
    var thing = new Observable({
      b: true
    })
    thing.subscribe({
      b: true
    })
    var Thing = thing.Constructor
    expect(function () {
      arr = []
      for (var i = 0; i < amount; i++) {
        var a = new Thing({
          b: i
        })
        arr.push(a)
      }
    }).performance({
      loop: 10,
      time: 100
    }, done)
  })
})
