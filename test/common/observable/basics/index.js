'use strict'

describe('basics', function () {
  var Observable = require('../../../../lib/observable')

  it('create new observable (obs)', function () {
    var specialobs = new Observable(10)
    expect(specialobs).instanceof(Observable)
    expect(specialobs.val).equals(10)
  })

  it('can create a reference', function () {
    var a = new Observable()
    var b = new Observable(a)
    expect(b._input).to.equal(a)
  })

  it('can create a reference to a child sharing the same parent', function () {
    var a = new Observable({
      a: true
    })
    a.set({ b: a.a })
    expect(a.b._input).to.equal(a.a)
  })
})
