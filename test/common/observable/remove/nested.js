'use strict'

describe('nested', function () {
  var Observable = require('../../../../lib/observable/')
  it(`should emit change event when property is removed due to parent / ancestor properties being removed`,
  function () {
    var a = new Observable({
      key: 'a',
      b: {
        c: true
      }
    })
    var count = 0
    a.b.c.on('data', function () {
      count++
    })
    a.b.remove()
    expect(count).to.equal(1)
  })
})
