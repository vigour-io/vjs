'use strict'

describe('Set and creation', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Base = require('../../lib/base')
  var Observable = require('../../lib/observable')
  // var Event = require('../../../lib/event')
  var amount = 1000
  var arr
  var factor = 5
  var n = 100

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
    it('creating ' + name + ' (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(observable).performance({
        loop: n,
        time: 15
      }, done)
    })

    it('creating ' + name + ' with a custom constructor (' + amount + ')', function (done) {
      this.timeout(50e3)
      var A = new Target().constructor
      expect(function () {
        // lookup overhead (closure) thats why 1.25
        arr = []
        for (var i = 0; i < amount; i++) {
          var a = new A({ //eslint-disable-line
            val: function () {},
            key: 'bla'
          })
          arr.push(a)
        }
      }).performance({
        loop: n,
        method: observable,
        margin: 1.25
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
        loop: n,
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
                  Target.apply(this, arguments)
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
        loop: n,
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
        loop: n,
        method: observable,
        margin: 3 * factor
      }, done)
    })

    it('creating nested ' + name + ' (2 levels with property and ChildConstructor) (' + amount + ')', function (done) {
      this.timeout(50e3)
      var A = new Target({
        properties: {
          b: new Target({
            ChildConstructor: new Target({}).Constructor
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
        loop: n,
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
        loop: n,
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
                  e () {}
                }
              }
            }
          })
          arr.push(a)
        }
      }).performance({
        loop: n,
        method: observable,
        margin: 5 * factor
      }, done)
    })
  }
})
