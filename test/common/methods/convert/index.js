var Base = require('../../../../lib/base/')

Base.prototype.inject(
  require('../../../../lib/methods/convert')
)

describe('convert', function () {
  var a
  beforeEach(function () {
    a = new Base({
      $key: 'a',
      x: {
        y: 123
      }
    })
  })

  it('should convert and be the deep equal to expected object', function () {
    var convertedObj = a.convert()
    var expectedObject = {
      x: {
        y: {
          $val: 123
        }
      }
    }
    expect(convertedObj).to.eql(expectedObject)
  })

  it('should output normal object', function () {
    var convertedObj = a.convert({
      plain: true
    })
    expect(convertedObj).to.be.an('object').and
                        .to.have.deep.property('x.y')
  })

  it('should convert function to string', function () {
    var convertedObj = a.convert({
      string: true
    })
    expect(convertedObj).to.be.an('string').and
                        .to.equal('{\n  "x": {\n    "y": {\n      "$val": 123\n    }\n  }\n}')
  })
  it('should exclude key/value', function () {
    var convertedObj = a.convert({
      exclude: function (val) {
        if (val === 'y') {
          return true
        }
      }
    })
    expect(convertedObj.x.y).to.be.undefined
  })

  it('should flatten Base object', function () {
    var convertedObj = a.convert({
      flatten: true
    })
    expect(convertedObj).to.have.property('x.y.$val')
  })
})
