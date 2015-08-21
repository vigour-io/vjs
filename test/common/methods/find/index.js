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

  it('should find property by path string', function() {
    var result = a.find('x.y.w.$val')

    expect(result).to.have.length(1)
    expect(result[0]).to.be.eql(a.x.y.w.$val)
  })

  it('should allow pass option cap and stop after certain number of matches', function() {
    var b = new Base({
      a: {
        x: 123
      },
      f: {
        r: 947
      },
      b: {
        y: {
          x: 456
        }
      },
      x: 987
    })


    var result = b.find('x', { cap: 2 })
    var resultWithouCap = b.find('x')

    expect(result).to.have.length(2)
    expect(resultWithouCap).to.have.length(3)
  })

})
