'use strict'
var Base = require('../../../lib/base')

describe('properties', function () {
  it('add and set basic property', function () {
    var a = new Base({
      properties: {
        rick: true
      }
    })
    a.set({ rick: 'dope' })
    expect(a.rick).equals('dope')
  })

  it('add and set base property (constructor)', function () {
    var rick = new Base()
    var a = new Base({
      properties: {
        rick: rick
      }
    })
    a.set({ rick: 'dope' })
    expect(a.rick.val).equals('dope')
    expect(a.rick).instanceof(rick.Constructor)
  })

  describe('boolean property definition', function () {
    it('should set the property (normally)', function () {
      var a = new Base({
        properties: {
          youri: true
        }
      })
      a.set({
        youri: 'hello'
      })
      expect(a.youri).equals('hello')
    })
  })

  describe('string property definition', function () {
    it('should set the defined field', function () {
      var a = new Base({
        properties: {
          youri: '_youri'
        }
      })
      a.set({
        youri: 'hello'
      })
      expect(a._youri).equals('hello')
    })
  })

  describe('custom set', function () {
    var a
    it('add and use set shortcut on a custom field', function () {
      a = new Base({
        key: 'a',
        properties: {
          something: { val: 'blurf' }
        }
      })
      expect(a.something).equals('blurf')
    })

    it('sets correct field', function () {
      a.set({ something: 'xxx' })
      expect(a.something).to.equal('xxx')
    })

    it('make instance', function () {
      a = new a.Constructor({
        key: 'aInstance',
        something: 'blurf'
      })
      expect(a.something).equals('blurf')
    })

    it('use overide', function () {
      a = new Base({
        key: 'a',
        properties: {
          something: {
            val: 'blurf',
            override: '_something'
          }
        }
      })
      expect(a._something).equals('blurf')
    })

    it('sets correct field', function () {
      a.set({ something: 'xxx' })
      expect(a._something).to.equal('xxx')
    })

    it('make instance', function () {
      a = new a.Constructor({
        key: 'aInstance',
        something: 'blurf'
      })
      expect(a._something).equals('blurf')
    })

    it('set base using val', function () {
      var marcus = new Base()
      var aBase = new Base({
        properties: {
          marcus: { val: marcus }
        }
      })

      expect(aBase).to.have.property('marcus').which.equals(marcus)
    })

    it('use base as a property (do not modify original base)', function () {
      var aBase = new Base({
        properties: {
          marcus: Base
        },
        marcus: true
      })
      expect(Base.prototype).to.not.have.property('_useVal')
      expect(Base.prototype).to.not.have.property('key')
      expect(aBase).to.have.property('marcus')
        .which.has.property('val')
        .which.equals(true)
    })
  })

  describe('custom overrides', function () {
    var a, b, c
    it('add and set base property on a custom field (constructor)', function () {
      var rick = new Base()
      a = new Base({
        key: 'a',
        properties: {
          rick: { val: rick, override: '_rick' }
        }
      })
      a.set({ rick: 'dope' })
      expect(a._rick.val).equals('dope')
      expect(a._rick).instanceof(rick.Constructor)
    })

    it('create an instance of a (b), have correct context', function () {
      b = new a.Constructor({
        key: 'b'
      })
      expect(b._rick.path[0]).equals('b')
    })

    it('create an instance of b (c), have correct context', function () {
      c = new b.Constructor({
        key: 'c'
      })
      expect(c._rick.path[0]).equals('c')
    })

    it('set rick on c', function () {
      c = new b.Constructor({
        key: 'c',
        rick: 'hello'
      })
      expect(c._rick).not.equals(b._rick)
    })
  })
})
