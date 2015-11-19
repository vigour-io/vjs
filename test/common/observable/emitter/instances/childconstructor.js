'use strict'
describe('use a childconstructor listener', function () {
  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  // var Observable
  var a = new Observable({
    key: 'a',
    on: {
      data: {
        test: function (data, event) {
          cnt++
        }
      }
    },
    // properties: {
    //   something:
    // },
    ChildConstructor: 'Constructor'
    // when you use a directly it will fail, since every field is an instance!
  })

  var branch = new a.Constructor({
    key: 'branch'
  })

  var aInstance = new a.Constructor({
    key: 'aInstance'
  })

  var bInstance = new aInstance.Constructor({
    key: 'bInstance'
  })

  it('set fields', function () {
    cnt = 0
    aInstance.set({
      something: {
        b: true
      }
    })
    expect(cnt).to.equal(4)
  })

  it('remove field', function () {
    cnt = 0
    aInstance.something.b.remove()
    expect(cnt).to.equal(3)
  })
})
