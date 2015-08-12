var Base = require('../../../../lib/base/')
var Get = require('../../../../lib/methods/get')

Base.prototype.inject(Get)

describe('get', function() {
  var a

  beforeEach(function() {
    a = new Base({
      x: {
        y: 123
      },
      z: 456
    })
  })

  it('should get a field passing a its name', function() {
    expect(a.get('z')).to.eql(a.z)
  })

  it('should get a field passing a its path', function() {
    expect(a.get(['x', 'y'])).to.eql(a.x.y)
  })

  it('should get undefined passing unexisting path or field', function() {
    expect(a.get('y')).to.be.undefined
    expect(a.get(['x', 'z'])).to.be.undefined
  })

})
