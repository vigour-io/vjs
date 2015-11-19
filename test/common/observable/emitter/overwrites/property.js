'use strict'
describe('property', function () {
  var Observable = require('../../../../../lib/observable')
  it('instance, block update on instance, nested, property', function () {
    console.clear()
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        property (data) {
          cnt++
        }
      }
    })
    var b = new a.Constructor({ //eslint-disable-line
      key: 'b',
      randomField: true
    })
    cnt = 0
    a.set({ randomField: 'this is a!' })
    expect(cnt).to.equal(1)
  })

  it('instance, block update on instance when removed, nested, property', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      randomField: 'haha',
      on: {
        property (data) {
          cnt++
        }
      }
    })
    var b = new a.Constructor({ //eslint-disable-line
      key: 'b',
      randomField: 'my own!'
    })
    cnt = 0
    a.set({ randomField: null })
    expect(cnt).to.equal(1)
  })
})
