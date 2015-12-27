'use strict'
describe('use a childconstructor listener', function () {

  // do do do

  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  var paths = []
  var colors = require('colors-browserify')
  console.line = false
  var a = new Observable({
    key: 'a',
    on: {
      data: {
        test: function (data, event) {
          console.log('yo g!', this.path.join('.'))
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

  var cInstance = new a.Constructor({
    key: 'cInstance'
  })

  var bInstance = new aInstance.Constructor({ // eslint-disable-line
    key: 'bInstance',
    // something: {} //totally wrong -- something.b should fire for b instance, bInstance should NOT fire this is overwrites of course
  })

  beforeEach(function () {
    cnt = 0
    paths = []
  })

  it('set fields', function () {
    console.log('YO YO YO DO IT why 5????--------'.cyan)

    aInstance.set({
      something: {
        b: true
      }
    })

    console.log('YO YO YO DO IT!')

    expect(cnt).to.equal(6)
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
