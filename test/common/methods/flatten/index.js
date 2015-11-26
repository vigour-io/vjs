'use strict'
var Base = require('../../../../lib/base/')

Base.prototype.inject(
  require('../../../../lib/methods/flatten')
)

describe('flatten', function () {
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
  it('should be able to flatten a Base object in standard JSON', function () {
    var flattened = a.flatten()
    expect(flattened).to.have.property('x.y')
    expect(flattened).to.not.have.property('x.y.val')
  })

  it('should not fail if an empty Base object is the caller', function () {
    var empty = new Base()
    expect(empty.flatten()).to.eql({})
  })

  it('should accept and apply a filter function passed as argument', function () {
    var filterFn = function (prop, key) {
      if (key === 'y') {
        return false
      }
      return true
    }
    expect(a.flatten(filterFn)).to.not.have.property('x.y')
    expect(a.flatten(filterFn)).to.not.have.property('x')
  })
})
