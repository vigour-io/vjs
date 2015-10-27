var Base = require('../../../../lib/base/')
var Get = require('../../../../lib/methods/get')

Base.prototype.inject(Get)

describe('get', function () {
  var a

  beforeEach(function () {
    a = new Base({
      key: 'a',
      x: {
        y: 123
      },
      z: 456
    })
    a.random = function () {}
    a.random.field = true
  })

  it('should get a field passing a its name', function () {
    expect(a.get('z')).to.eql(a.z)
  })

  it('should get a field passing a its path', function () {
    expect(a.get(['x', 'y'])).to.eql(a.x.y)
  })

  it('should get undefined passing unexisting path or field', function () {
    expect(a.get('y')).to.be.undefined
    expect(a.get(['x', 'z'])).to.be.undefined
  })

  it('should not work for strings', function () {
    expect(a.get(['key', 'nope'])).to.be.undefined
  })

  it('should work for functions', function () {
    expect(a.get(['random', 'nope'])).to.be.undefined
    expect(a.get(['random', 'field'])).equals(true)
  })
})
