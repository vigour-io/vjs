var Base = require('../../../../lib/base/')

Base.prototype.inject(
  require('../../../../lib/methods/plain')
)

describe('plain', function () {
  // setup
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

  // tests
  it('should be able to convert a Base object in standard JSON', function () {
    var expected = {
      x: {
        y: 123
      },
      '$z': 'zContent'
    }
    expect(a.plain()).to.eql(expected)
  })

  it('should return an empty JSON if Base doesn\'t have properties', function () {
    var expected = {}
    var newBase = new Base()
    expect(newBase.plain()).to.eql(expected)
  })

  it('should be able to apply a filter function the result object', function () {
    var expected = {
      x: {},
      '$z': 'zContent'
    }
    var filterFn = function (prop, key) {
      if (key === 'y') {
        return false
      }
      return true
    }
    expect(a.plain(filterFn)).to.eql(expected)
  })
})
