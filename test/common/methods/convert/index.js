var Base = require('../../../../lib/base/')

Base.prototype.inject(
  require('../../../../lib/methods/convert')
)

describe('convert', function () {
  var a
  beforeEach(function () {
    a = new Base({
      key: 'a',
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
          val: 123
        }
      }
    }
    expect(convertedObj).to.eql(expectedObject)
  })

  it('should output normal object', function () {
    var convertedObj = a.convert({
      plain: true
    })
    expect(convertedObj)
      .to.be.an('object').and
      .to.have.deep.property('x.y')
  })

  it('should convert function to string', function () {
    var convertedObj = a.convert({
      string: true
    })
    expect(convertedObj)
      .to.be.an('string').and
      .to.equal('{\n  "x": {\n    "y": {\n      "val": 123\n    }\n  }\n}')
  })

  it('should exclude key/value', function () {
    var convertedObj = a.convert({
      exclude: function (property, key) {
        if (key === 'y') {
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
    expect(convertedObj).to.have.property('x.y.val')
  })

  it('should handle arrays', function () {
    var original = { arr: [1, { x: true, y: false, z: ['a', 'b', ['c']] }, 3] }
    var base = new Base(original)
    var convertedObj = base.convert({ plain: true })
    expect(convertedObj).to.deep.equal(original)
  })

  xit('should handle empty arrays', function () {
    var original = { arr: [] }
    var base = new Base(original)
    var convertedObj = base.convert({ plain: true })
    expect(convertedObj).to.deep.equal(original)
  })

  describe('length', function () {
    var l = 10
    var short = []
    var long = []
    for (var i = 0; i < l; i += 1) {
      short.push(i)
      long.push(i)
    }
    // long array has one more element
    long.push(i)
    it('should handle short arrays', function () {
      var original = {
        arr: short
      }
      var base = new Base(original)
      var convertedObj = base.convert({ plain: true })
      expect(convertedObj).to.deep.equal(original)
    })

    xit('should handle long arrays', function () {
      var original = {
        arr: long
      }
      var base = new Base(original)
      var convertedObj = base.convert({ plain: true })
      expect(convertedObj).to.deep.equal(original)
    })
  })
})
