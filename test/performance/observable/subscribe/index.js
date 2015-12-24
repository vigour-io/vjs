'use strict'

describe('Subscribe', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Observable = require('../../../../lib/observable')
  // var Event = require('../../../lib/event')
  var amount = 1000
  var arr

  describe('Observable default emitters (baseline)', function () {
    function baseline () {
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
    }

    it('creating observables add listeners and fire on existing field (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(baseline).performance({
        loop: 100,
        time: 200
      }, done)
    })

    it('firing listeners on observables (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        var len = arr.length
        for (let i = 0; i < len; i++) {
          arr[i].val = i * 2
        }
      }).performance({
        loop: 100,
        time: 100,
        before: baseline
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
        loop: 100,
        time: 100
      }, done)
    })
  })

  // describe('Existing field', function () {
  //   function observable () {
  //     arr = []
  //     for (var i = 0; i < amount; i++) {
  //       var a = new Observable({ //eslint-disable-line
  //         b: true
  //       })
  //       a.subscribe({
  //         b: true
  //       }, function () {})
  //       arr.push(a)
  //     }
  //   }
  //
  //   it('creating observables and subscribing on existing field (' + amount + ')', function (done) {
  //     this.timeout(50e3)
  //     expect(observable).performance({
  //       loop: 100,
  //       time: 100
  //     }, done)
  //   })
  //
  //   it('firing listeners on observables and subscribing on existing field (' + amount + ')', function (done) {
  //     this.timeout(50e3)
  //     expect(function () {
  //       var len = arr.length
  //       for (let i = 0; i < len; i++) {
  //         arr[i].b.val = i * 2
  //       }
  //     }).performance({
  //       loop: 100,
  //       time: 100,
  //       before: observable
  //     }, done)
  //   })
  //
  //   it('creating observables subscribing using context (' + amount + ')', function (done) {
  //     this.timeout(50e3)
  //     var thing = new Observable({
  //       b: true
  //     })
  //     thing.subscribe({
  //       b: true
  //     })
  //     var Thing = thing.Constructor
  //     expect(function () {
  //       arr = []
  //       for (var i = 0; i < amount; i++) {
  //         var a = new Thing({
  //           b: i
  //         })
  //         arr.push(a)
  //       }
  //     }).performance({
  //       loop: 100,
  //       time: 100
  //     }, done)
  //   })
  // })
})
