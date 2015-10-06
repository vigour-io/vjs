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
      },
      properties: {
        z: '$z'
      },
      z: 'zContent'
    })
  })

  it('should provide a base functionality', function () {
    var convertedObj = a.convert()
    var expectedObject = {
      x: {
        y: {
          val: 123
        }
      },
      '$z': 'zContent'
    }
    expect(convertedObj).to.eql(expectedObject)
  })

  it('should be able to apply a filter to the converted result', function () {
    var expected = {
      x: {},
      '$z': 'zContent'
    }
    var filterFn = function (prop, key, base) {
      if (key === 'y' || base.properties[key]) {
        return false
      }
      return true
    }
    expect(a.convert({
      plain: true,
      filter: filterFn
    })).to.eql(expected)
  })

  it('should convert function to string', function () {
    var convertedObj = a.convert({
      string: true
    })
    expect(convertedObj)
      .to.be.an('string').and
      .to.equal('{\n  "x": {\n    "y": {\n      "val": 123\n    }\n  },\n  "$z": "zContent"\n}')
  })

  it('should flatten Base object', function () {
    expect(a.flatten()).to.have.property('x.y.val')
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

    it('should handle long arrays', function () {
      var original = {
        arr: long
      }
      var base = new Base(original)
      var convertedObj = base.convert({ plain: true })
      expect(convertedObj).to.deep.equal(original)
    })
  })
})
