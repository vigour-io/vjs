'use strict'
var Base = require('../../../../lib/base/')

Base.prototype.inject(
  require('../../../../lib/methods/serialize')
)

describe('serialize', function () {
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

  it('should convert and be the deep equal to expected object', function () {
    var convertedObj = a.serialize()
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

  it('should exclude key/value', function () {
    var convertedObj = a.serialize(function (property, key) {
      if (key === 'y') {
        return false
      }
      return true
    })
    expect(convertedObj.x.y).to.be.undefined
  })

  // move this to another test -- maybe do the array as an option or other method?
  xit('should handle arrays', function () {
    var original = {
      arr: [
        { val: 1 },
        {
          x: { val: true },
          y: { val: false },
          z: [
            { val: 'a' },
            { val: 'b' },
            [{val: 'c'}]]
        },
        {val: 3}
      ]
    }
    var base = new Base(original)
    var convertedObj = base.serialize()
    expect(convertedObj).to.deep.equal(original)
  })
})
