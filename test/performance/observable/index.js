'use strict'

describe('Observable', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Observable = require('../../../lib/observable')
  // var Event = require('../../../lib/event')
  var amount = 10000

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
    function fn () {}
    for (var i = 0; i < amount; i++) {
      var a = new Observable({ //eslint-disable-line
        on: { data: fn }
      })
    }
  }

  require('./remove')

  // xit('creating observables with listeners (' + amount + ')', function (done) {
  //   this.timeout(50e3)
  //   expect(listenerObservable).performance({
  //     // loop: 100,
  //     method: observable,
  //     margin: 5
  //   }, done)
  // })
  //
  // // need to clear the objects etc
  // xit('creating observables with listeners, fire them (' + amount + ')', function (done) {
  //   this.timeout(50e3)
  //   expect(function () {
  //     for (var i = 0; i < amount; i++) {
  //       var a = new Observable({ //eslint-disable-line
  //         on: { data: function () {} }
  //       })
  //       a.val = i
  //     }
  //   }).performance({
  //     // loop: 100,
  //     method: listenerObservable,
  //     margin: 1.5
  //   }, done)
  // })
})
