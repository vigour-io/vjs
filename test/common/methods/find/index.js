var Base = require('../../../../lib/base/')
var Find = require('../../../../lib/methods/find')

Base.prototype.inject(Find)

describe('find', function() {
  var a

  beforeEach(function() {
    a = new Base({
      $key: 'a',
      x: {
        y: {
          z: 123,
          w: 456
        },
      },
      alfa: 789
    })
  })

  it('should find nested property', function() {
    var result = a.find('w')

    expect(result).to.have.length(1)
    expect(result[0]).to.be.eql(a.x.y.w)
  })

  it('should not find nested property', function() {
    var result = a.find('j')

    expect(result).to.have.length(0)
  })

  it('should find by path', function() {
    var result = a.find(['x', 'y', 'z'])

    expect(result).to.have.length(1)
    expect(result[0]).to.be.eql(a.x.y.z)
  })

  it('should not find by path', function() {
    var result = a.find(['x', 'j'])

    expect(result).to.have.length(0)
  })

})
