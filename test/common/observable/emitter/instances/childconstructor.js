'use strict'
describe('use a childconstructor listener', function () {
  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  var paths = []
  var a = new Observable({
    key: 'a',
    on: {
      data: {
        test: function (data, event) {
          paths.push(this.path.join('.'))
          cnt++
        }
      }
    },
    ChildConstructor: 'Constructor'
    // when you use a directly it will fail, since every field is an instance!
  })

  var branch = new a.Constructor({ // eslint-disable-line
    key: 'branch'
  })

  var aInstance = new a.Constructor({
    key: 'aInstance'
  })

  var bInstance = new aInstance.Constructor({ // eslint-disable-line
    key: 'bInstance'
  })

  beforeEach(function () {
    cnt = 0
    paths = []
  })

  it('set fields', function () {
    aInstance.set({
      something: {
        b: true
      }
    })
    expect(cnt).to.equal(4)
  })

  it('remove field', function () {
    aInstance.something.b.remove()
    expect(paths).to.deep.equal([
      'bInstance.something.b',
      'aInstance.something.b',
      'bInstance.something',
      'aInstance.something'
    ])
    expect(cnt).to.equal(4)
  })
})
