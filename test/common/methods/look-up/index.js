var Base = require('../../../../lib/base/')
var LookUp = require('../../../../lib/methods/lookUp')

Base.prototype.inject(LookUp)

describe('lookUp', function() {
  var a

  beforeEach(function() {
    a = new Base({
      $key: 'b',
      x: {
        y: {
          $val: 'test',
          z: {
            w: {
              myProp: 1010
            }
          }
        }
      },
      i: {
        j: {
          x: {
            $val: 123
          }
        },
        k: {
          y: {
            $val: 321
          }
        }
      }
    })
  })

  it('should look up simple field', function() {
    var result = a.x.y.z.w.lookUp('y.$val')
    expect(result).to.eql('test')
  })

  it('should look up with path array', function() {
    var result = a.x.y.z.w.lookUp(['y', '$val'])
    expect(result).to.eql('test')
  })

  it('should look up and execute function', function() {
    var result = a.i.j.x.lookUp('i').lookDown('y.$val')
    expect(result).to.eql(321)
  })

  it('should look up and execute function in string', function() {
    var result = a.i.j.x.lookUp('i.lookDown.y.$val')
    expect(result).to.eql(321)
  })

})
