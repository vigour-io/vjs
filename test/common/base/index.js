'use strict'

describe('base', function () {
  var Base = require('../../../lib/base')
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

  it('should handle buffers', function () {
    var buffer = new Buffer('boom')
    var base = new Base(buffer)
    expect(base.val).to.equal(buffer)
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

  describe('ChildConstructor', function () {
    it('ChildConstructor false creates normal fields', function () {
      var a = new Base({
        ChildConstructor: false,
        field: true
      })
      expect(a.field).to.equal(true)
    })
  })

  require('./output.js')
  require('./property.js')
  require('./context.js')
})
