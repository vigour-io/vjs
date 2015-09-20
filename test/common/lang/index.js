/* global describe, it, expect */
describe('getPrototypeOf', function () {
  it('should support getPrototypeOf', function () {
    var b = {
      field: true
    }
    var A = function () {}
    A.prototype = b
    var c = new A()
    expect(Object.getPrototypeOf(c)).to.have.property('field')
  })
})
