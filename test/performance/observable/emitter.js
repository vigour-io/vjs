'use strict'

describe('Emitter', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Base = require('../../../lib/base')
  var Observable = require('../../../lib/observable')
  // var Event = require('../../../lib/event')
  var amount = 10000
  var arr

  runtests(Observable, 'observable')

  function runtests (Target, name) {
    function observableListener () {
      arr = []
      for (var i = 0; i < amount; i++) {
        var a = new Target({ //eslint-disable-line
          on: { data: function () {} }
        })
        arr.push(a)
      }
    }

    it('creating ' + name + ' with listeners (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(observableListener).performance({
        loop: 10,
        time: 60
      }, done)
    })
  }
})
