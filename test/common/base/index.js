var Base = require('../../../lib/base')

describe('base', function () {
  var a
  beforeEach(function () {
    a = new Base({
      key: 'a',
      val: 123,
      x: 1
    })
  })

  it('should have the internal key', function () {
    expect(a.key).to.be.eql('a')
  })

  it('should have simple value', function () {
    expect(a.val).to.be.eql(123)
  })

  it('should have properties values', function () {
    expect(a.x).to.be.defined
    expect(a.x.val).to.be.equal(1)
  })

  it('should be able to set property value', function () {
    a.set({ x: 2 })
    expect(a.x.val).to.be.equal(2)
  })

  it('should have a path in property value', function () {
    expect(a.x.path).to.be.eql(['a', 'x'])
  })

  it('should expose a Constructor', function () {
    expect(a.Constructor).to.be.a('function')
  })

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

  describe('derived types', function () {
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

  describe('data', function () {
    var c, setValueSpy
    beforeEach(function () {
      c = new Base({
        val: 'rahh',
        x: {
          x1: 1,
          x2: 2,
          x3: {
            y: 123
          }
        }
      })
      setValueSpy = sinon.spy(c, 'setValue')
    })

    it('Should return undefined when there are no/same changes for value', function () {
      c.val = 'rahh'
      expect(setValueSpy).to.have.returned(undefined)
    })

    it('Should return base when there are changes for value', function () {
      c.val = 'rehh'
      expect(setValueSpy).not.to.have.returned(undefined)
    })

    it('Should return undefined for set when there are no/same changes', function () {
      var setSpy = sinon.spy(c, 'set')
      c.set({
        x: {
          x1: 1
        }
      })
      expect(setSpy).to.have.returned(undefined)
    })

    it('Should return undefined for set when there are only deep changes', function () {
      var setSpy = sinon.spy(c, 'set')
      c.set({
        x: {
          x1: 2
        }
      })
      expect(setSpy).to.have.returned(void 0)
    })

    it('Should return base for set property when there are changes', function () {
      var setSpy = sinon.spy(c.x.x1, 'set')
      c.x.x1.set(2)
      expect(setSpy).to.have.been.called
    })

    it('Should return base for set val when there are changes', function () {
      var setSpy = sinon.spy(c.x.x1, 'set')
      c.x.x1.val = 2
      expect(setSpy).to.have.returned(c.x.x1)
    })

    it('Should not return undefined for setKey when there are changes', function () {
      var setKeySpy = sinon.spy(c, 'setKey')
      c.setKey('test', 1)
      expect(setKeySpy).not.to.have.returned(undefined)
    })

    it('Should return undefined for setKey when there are no/same changes', function () {
      c.setKey('test', 1)
      var setKeySpy = sinon.spy(c, 'setKey')
      c.setKey('test', 1)
      expect(setKeySpy).to.have.returned(undefined)
    })
  })

  describe('remove', function () {
    var theObj
    beforeEach(function () {
      theObj = new Base({
        key: 'theObj',
        a: {
          a1: {
            a11: true
          },
          a2: {
            a21: 123
          }
        }
      })
    })

    it('should remove property with setValue null', function () {
      theObj.a.a1.setValue(null)
      expect(theObj.a.a1).to.be.null
    })

    it('should remove property with value null', function () {
      theObj.a.a1.val = null
      expect(theObj.a.a1).to.be.null
    })

    it('should remove property with set null', function () {
      theObj.a.set({ a1: null })
      expect(theObj.a).to.be.defined
      expect(theObj.a.a1).to.be.null
    })

    it('should remove from derived type', function () {
      var anotherObj = new theObj.Constructor({
        key: 'anotherObj'
      })
      anotherObj.a.remove()
      expect(theObj.a).to.be.defined
      expect(anotherObj.a).to.be.null
    })
  })

  describe('instances of properties', function () {
    var a = new Base({
      key: 'a',
      b: {}
    })
    it('creates a new instance of a.b and should not have a parent', function () {
      var c = new a.b.Constructor()
      expect(c._parent).to.be.null
    })
  })

  require('./output.js')
  require('./property.js')
})
