var Base = require('../../../../lib/base/')
var Map = require('../../../../lib/methods/map')

Base.prototype.inject(Map)

describe('map', function() {
  var a, spy, result

  beforeEach(function() {
    a = new Base({
      $key: 'a',
      x: {
        k: {
          l: 123
        }
      },
      y: {
        e: 456
      }
    })

    spy = sinon.spy(function(eachProp, key, base) {
      return eachProp.$key
    })

    result = a.map(spy)
  })

  it('should have been called with the correct parameters', function() {
    expect(spy).to.have.been.calledWith(a.x, 'x', a)
  })

  it('should call argument function in each root prop of the base object', function() {
    expect(spy).to.have.been.calledTwice //root props [x. y]
  })

  it('should return the correct mapped array', function() {
    expect(result).to.eql(['x', 'y'])
  })

  it('should allow exclude some results with optional function', function() {
    var newResult = a.map(spy, function(currentProp) {
      if (currentProp.$key === 'x') {
        return true
      }
    })

    expect(newResult).to.eql(['y'])
  })

})
