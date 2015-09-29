describe('emitter', function () {
  var Emitter = require('../../../lib/emitter')
  var Base = require('../../../lib/base')

  describe('add listener and fire once', function () {
    var emitter = new Emitter()
    var cnt = 0
    emitter.on(function (event, type) {
      cnt++
    })
    emitter.emit()
    it('should have fired once', function () {
      expect(cnt).to.equal(1)
    })
  })

  describe('add and remove listener', function () {
    var emitter = new Emitter()

    function listener (event, type) {}
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
    function listener (event, type) {}
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
    function listener (event, type) {}
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
    function listener (event, type) {}
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
    function listener (event, type) {
      cnt++
    }
    xit('should have add listener', function () {
      a.on(listener, 'val')
      a.emit('data') //add meta handle
      expect(cnt).equals(1)
      expect(a.fn).to.be.ok
      expect(a.fn.val).to.be.ok
    })

    xit('remove val listener', function () {
      expect(a.fn).to.be.ok
      a.off('val')
      expect(a.fn).to.be.not.ok
    })
  })
})
