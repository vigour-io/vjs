var Base = require('../../../lib/base')

// console.clear()

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
