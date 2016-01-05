'use strict'
describe('reference emitter', function () {
  var Observable = require('../../../../../lib/observable/')
  it('should fire with the old reference', function (done) {
    var a = new Observable()
    var b = new Observable({ key: 'b' })
    var c = new Observable({ key: 'c' })

    b.set({
      on: {
        reference (data) {
          expect(data).to.equal(a)
          done()
        }
      },
      val: a
    })
    b.val = c
  })
})
