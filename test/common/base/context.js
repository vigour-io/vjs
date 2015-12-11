'use strict'
describe('context', function () {
  var Base = require('../../../lib/base')

  describe('nested properties', function () {
    var a
    beforeEach(function () {
      a = new Base({
        key: 'a',
        x: {
          y: {
            z: true
          }
        }
      })
    })

    it('should have a value', function () {
      expect(a.x.y.z.val).to.be.equal(true)
    })

    it('should be instances and prototype of Base', function () {
      expect(a.x).to.be.instanceOf(Base)
      expect(a.x.y).to.be.instanceOf(Base)
      expect(a.x.y.z).to.be.instanceOf(Base)
      expect(Object.getPrototypeOf(a.x)).to.be.equal(Base.prototype)
      expect(Object.getPrototypeOf(a.x.y)).to.be.equal(Base.prototype)
      expect(Object.getPrototypeOf(a.x.y.z)).to.be.equal(Base.prototype)
    })

    it('should call generate context getter when get Constructor', function () {
      var spyX = sinon.spy(a.x, 'createContextGetter')
      var spyXY = sinon.spy(a.x.y, 'createContextGetter')

      expect(spyX).to.not.have.been.called
      expect(spyXY).to.not.have.been.called

      var constructor = a.Constructor
      expect(constructor).to.have.property('prototype')
      expect(spyX).to.have.been.called
      expect(spyXY).to.have.been.called
    })
  })

  describe('nested, different types', function () {
    var a, b, AConstructor
    beforeEach(function () {
      a = new Base({
        key: 'a',
        x: {
          y: {
            z: true
          }
        }
      })
      AConstructor = a.Constructor
      b = new AConstructor({ key: 'b' })
    })

    it('should heir derived properties and their values', function () {
      expect(b.x.y.z).to.be.defined
      expect(b.x.y.z.val).to.be.equal(true)
    })

    it('should have the correct _context and _contextLevel for derived object', function () {
      expect(b.x._context === b).to.equal(true)
      expect(b.x.y._context === b).to.equal(true)
      expect(b.x.y.z._context === b).to.equal(true)
      expect(b.x._contextLevel).to.equal(1)
      expect(b.x.y._contextLevel).to.equal(2)
      expect(b.x.y.z._contextLevel).to.equal(3)
    })

    it('should not have _context and _contextLevel for parent object', function () {
      expect(a.x._context).to.be.undefined
      expect(a.x.y._context).to.be.undefined
      expect(a.x.y.z._context).to.be.undefined
      expect(a.x._contextLevel).to.be.undefined
      expect(a.x.y._contextLevel).to.be.undefined
      expect(a.x.y.z._contextLevel).to.be.undefined
    })

    it('should hae the correct path', function () {
      expect(a.x.y.z.path).to.eql(['a', 'x', 'y', 'z'])
      expect(b.x.y.z.path).to.eql(['b', 'x', 'y', 'z'])
    })

    it('Resolve context set should be triggered', function () {
      var zResolveContextSetSpy = sinon.spy(b.x.y.z, 'resolveContext')
      b.x.y.z.val = 'rahh!'
      expect(zResolveContextSetSpy).to.have.been.called
      expect(zResolveContextSetSpy).to.have.returned(b.x.y.z)
    })

    it('After resolve context it _context and _contextLevel should be cleared', function () {
      b.x.y.z.val = 'rahh!'
      expect(b.x.y.z._context).to.be.null
      expect(b.x.y.z._contextLevel).to.be.null
    })

    it('When set same value (no changes), it should return undefined and do not resolve the context', function () {
      var spy = sinon.spy(a.x.y.z, 'set')
      b.x.y.z.val = true
      expect(spy).to.have.returned(undefined)
      expect(b.x.y.z).not.to.be.instanceOf(a.x.y.z.Constructor)
      expect(b.x._parent === a).to.be.true
    })

    it('When set different value should return base after context has been resolved', function () {
      var spy = sinon.spy(a.x.y.z, 'set')
      b.x.y.z.val = 123
      expect(spy).to.have.returned(b.x.y.z)
      expect(b.x.y.z).to.be.instanceOf(a.x.y.z.Constructor)
      expect(b.x._parent !== a).to.be.true
    })
  })

  describe('property', function () {
    var Foo = new Base().Constructor
    var a, b, c

    it('creates a, set properties', function () {
      a = new Base({
        key: 'a',
        nested: {
          properties: {
            foo: Foo
          }
        }
      })
    })

    it('creates instance of b', function () {
      b = new a.Constructor({
        key: 'b',
        nested: {
          foo: true
        }
      })
      expect(b.nested).to.have.property('foo').which.instanceof(Foo)
    })

    it('create a context getter for nested.foo', function () {
      c = new b.Constructor({
        key: 'c'
      })
      expect(b.nested).to.have.property('_foo')
    })

    it('nested property on c should have correct path', function () {
      expect(c.nested.foo.path).deep.equals(['c', 'nested', 'foo'])
    })
  })
})
