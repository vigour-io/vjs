'use strict'

describe('Set and creation', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Base = require('../../lib/base')
  var Observable = require('../../lib/observable')
  // var Event = require('../../../lib/event')
  var amount = 10000
  var arr

  describe('Base', function () {
    runtests(Base, 'base')
  })
  // describe('Observable', function () {
  //   runtests(Observable, 'observable')
  // })

  // make this the set test suite
  function runtests (Target, name) {
    function observable () {
      arr = []
      for (var i = 0; i < amount; i++) {
        var a = new Target({ //eslint-disable-line
          val: function () {}
        })
        arr.push(a)
      }
    }

    it('creating ' + name + ' (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(observable).performance({
        loop: 10,
        time: 15
      }, done)
    })

    it('creating nested ' + name + ' (1 level) (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        arr = []
        for (var i = 0; i < amount; i++) {
          var a = new Target({ //eslint-disable-line
            bla: function () {}
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        time: 30
      }, done)
    })

    it('creating nested ' + name + ' (1 level with property) (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        arr = []
        for (var i = 0; i < amount; i++) {
          var a = new Target({ //eslint-disable-line
            bla: function () {}
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        time: 30
      }, done)
    })

    it('creating nested ' + name + ' (2 levels) (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        arr = []
        // this is way to slow should not be like this!
        for (var i = 0; i < amount; i++) {
          var a = new Target({ //eslint-disable-line
            bla: {
              xur: function () {}
            }
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        time: 45
      }, done)
    })

    it('creating nested ' + name + ' (3 levels) (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        arr = []
        // this is way to slow should not be like this!
        for (var i = 0; i < amount; i++) {
          var a = new Target({ //eslint-disable-line
            bla: {
              xur: {
                flups: function () {}
              }
            }
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        time: 60
      }, done)
    })

    // increases exponential with levels thats wrong
    it('creating nested ' + name + ' (4 levels) (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        arr = []
        // this is way to slow should not be like this!
        for (var i = 0; i < amount; i++) {
          var a = new Target({ //eslint-disable-line
            bla: {
              xur: {
                flups: {
                  flaps: function () {}
                }
              }
            }
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        time: 75
      }, done)
    })
  }



  // function observableListener () {
  //   arr = []
  //   for (var i = 0; i < amount; i++) {
  //     var a = new Target({ //eslint-disable-line
  //       on: { data: function () {} }
  //     })
  //     arr.push(a)
  //   }
  // }
  //
  // xit('creating ' + name + ' with listeners (' + amount + ')', function (done) {
  //   this.timeout(50e3)
  //   expect(observableListener).performance({
  //     loop: 10,
  //     time: 60
  //   }, done)
  // })

})
