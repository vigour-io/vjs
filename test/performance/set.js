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
  describe('Observable', function () {
    runtests(Observable, 'observable')
  })

  // make this the set test suite
  function runtests (Target, name) {
    function observable () {
      arr = []
      for (var i = 0; i < amount; i++) {
        var a = new Target({ //eslint-disable-line
          val: function () {},
          key: 'bla'
        })
        arr.push(a)
      }
    }

    // overhead factor
    var factor = 5

    it('creating ' + name + ' (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(observable).performance({
        loop: 10,
        time: 15
      }, done)
    })

    it('creating ' + name + ' with a custom constructor (' + amount + ')', function (done) {
      this.timeout(50e3)
      var A = new Target().constructor
      expect(function () {
        // lookup overhead (closure) thats why 2
        arr = []
        for (var i = 0; i < amount; i++) {
          var a = new A({ //eslint-disable-line
            val: function () {},
            key: 'bla'
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        method: observable
      }, done)
    })

    it('creating nested ' + name + ' (1 level) (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        arr = []
        for (var i = 0; i < amount; i++) {
          var a = new Target({ //eslint-disable-line
            b: function () {}
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        method: observable,
        margin: 2 * factor
      }, done)
    })

    it('creating nested ' + name + ' (1 level with property) (' + amount + ')', function (done) {
      this.timeout(50e3)
      var A = new Target({
        properties: {
          b: new Target({
            define: {
              generateConstructor () {
                return function () {
                  Base.apply(this, arguments)
                }
              }
            }
          })
        }
      }).Constructor
      expect(function () {
        arr = []
        for (var i = 0; i < amount; i++) {
          var a = new A({ //eslint-disable-line
            b: function () {}
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        method: observable,
        margin: 2 * factor
      }, done)
    })

    it('creating nested ' + name + ' (2 levels) (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        arr = []
        // this is way to slow should not be like this!
        for (var i = 0; i < amount; i++) {
          var a = new Target({ //eslint-disable-line
            b: {
              c: function () {}
            }
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        method: observable,
        margin: 3 * factor
      }, done)
    })

    it('creating nested ' + name + ' (3 levels) (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        arr = []
        // this is way to slow should not be like this!
        for (var i = 0; i < amount; i++) {
          var a = new Target({ //eslint-disable-line
            b: {
              c: {
                d: function () {}
              }
            }
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        method: observable,
        margin: 4 * factor
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
            b: {
              c: {
                d: {
                  e: function () {}
                }
              }
            }
          })
          arr.push(a)
        }
      }).performance({
        loop: 10,
        method: observable,
        margin: 5 * factor
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
