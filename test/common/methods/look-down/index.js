var Base = require('../../../../lib/base/')
var LookDown = require('../../../../lib/methods/lookDown')

Base.prototype.inject(LookDown)

describe('lookDown', function() {
  var a

  beforeEach(function() {
    a = new Base({
      $key: 'a',
      x: {
        y: 123,
        w: {
          r: {
            q: 132
          }
        },
        j: {
          q: 456
        },
        i: {
          m: {
            q: 957
          }
        }
      },

    })
  })

  it('should look down and find a property by field', function() {
    var result = a.lookDown('y')
    expect(result).to.be.eql(a.x.y)
  })

  it('should look down and find a property by path string', function() {
    var result = a.lookDown('y.$val')
    expect(result).to.be.eql(a.x.y.$val)
  })

  it('should look down and find a property by path array', function() {
    var result = a.lookDown(['x', 'y'])
    expect(result).to.be.eql(a.x.y)
  })

  it('should look down for the first occurence of q.$val', function() {
    var result = a.x.lookDown('q.$val')
    expect(result).to.eql(a.x.j.q.$val)
  })

  it('should look down for the first occurence of q.$val 2 levels', function() {
    a.x.j.remove();

    var result = a.x.lookDown('q.$val')
    expect(result).to.eql(132)
  })

  it('should look down for the first occurence of q.$val 3 levels', function() {
    var b = new Base({
      $key: 'b',
      e: {
        f: {
          g: {
            h: {
              anotherProp: 'rahh'
            }
          }
        }
      },
      x: {
        y: {
          z: {
            w: {
              myProp: 1010
            }
          }
        }
      },
      i: {
        j: {
          k: {
            l: {
              myProp: 2020
            }
          }
        }
      }
    });

    expect(b.lookDown('myProp.$val')).to.eql(1010)
  })

})
