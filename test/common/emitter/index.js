'use strict'
describe('emitter', function () {
  var Emitter = require('../../../lib/emitter')
  var Base = require('../../../lib/base')

  describe('add listener and fire once', function () {
    var emitter = new Emitter()
    var cnt = 0
    var dataMeasure
    emitter.on(function (data) {
      dataMeasure = data
      cnt++
    })
    it('should have fired once', function () {
      emitter.emit('something')
      expect(dataMeasure).to.equal('something')
      expect(cnt).to.equal(1)
    })
  })

  describe('add and remove listener', function () {
    var emitter = new Emitter()
    function listener () {}
    it('should have a fn field', function () {
      emitter.on(listener)
      expect(emitter.fn[1]).to.be.ok
      expect(emitter.fn).to.be.ok
    })
    it('should not have fn field', function () {
      emitter.off(listener)
      expect(emitter.fn).to.be.not.ok
    })
  })

  describe('add and remove listener by key', function () {
    var a = new Emitter()
    function listener () {}
    it('should have fn field', function () {
      a.on(listener, 'hello')
      expect(a.fn).ok
    })
    it('should not have fn field', function () {
      a.off('hello')
      expect(a.fn).not.ok
    })
  })

  describe('add a base listener remove listener', function () {
    var a = new Emitter()
    var base = new Base()
    it('should have base field', function () {
      a.on(base)
      expect(a.base).ok
    })
    it('should not have base field', function () {
      a.off(base)
      expect(a.base).not.ok
    })
  })

  describe('add a attach listener remove listener by base', function () {
    var a = new Emitter()
    var base = new Base()
    function listener () {}
    it('should have attach field', function () {
      a.on([ listener, base ])
      expect(a.attach).to.be.ok
    })
    it('should not have attach field', function () {
      a.off(base)
      expect(a.attach).to.be.not.ok
    })
  })

  describe('add a attach listener remove listener by object', function () {
    var a = new Emitter()
    var base = new Base()
    function listener () {}
    it('should have attach field', function () {
      a.on([ listener, base ])
      expect(a.attach).to.be.ok
    })
    it('should not have attach field', function () {
      a.off({ attach: base })
      expect(a.attach).to.be.not.ok
    })
  })

  describe('use val listener (default)', function () {
    var a = new Emitter()
    var cnt = 0
    function listener () {
      cnt++
    }
    it('should have add listener', function () {
      a.on(listener, 'val')
      a.emit('data') // add meta handle
      expect(cnt).equals(1)
      expect(a.fn).to.be.ok
      expect(a.fn.val).to.be.ok
    })
    it('remove val listener', function () {
      expect(a.fn).to.be.ok
      a.off('val')
      expect(a.fn).to.be.not.ok
    })
  })

  describe('multiple events at the same time', function () {
    var a = new Emitter()
    var Event = require('../../../lib/event')

    it('can fire for multiple events', function () {
      var dataArray = []
      function listener (data, event) {
        dataArray.push(data)
      }
      var eventA = new Event(a)
      eventA.isTriggered = true
      var eventB = new Event(a)
      a.on(listener)
      a.emit('a', eventA)
      a.emit('b', eventB)
      eventA.isTriggered = null
      a.emit('a', eventA)
      expect(dataArray).to.deep.equal(['b', 'a'])
    })
  })

  describe('once', function () {
    var a = new Emitter()
    it('fires once, function, listener gets removed', function (done) {
      a.once(function () {
        expect(a.fn).not.ok
        done()
      })
      a.emit('data')
    })
  })

  require('./error')
})
