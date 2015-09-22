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
})
