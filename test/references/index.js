var test = require('../')
var describe = test.describe
var it = test.it
var expect = test.expect

describe('References', function () {

  var Base
  it('require Base', function () {
    Base = require('../../lib/base')
  })

  var first
  it('make first, ', function () {
    first = new Base('firstval')
    expect(first.$val).to.equal('firstval')
  })

  var second
  it('make second (reference to first)', function () {
    second = new Base(first)
    expect(second.$val).to.equal('firstval')
  })

  var third
  it('make third (reference to second)', function () {
    third = new Base(second)
    expect(third.$val).to.equal('firstval')
  })

})
