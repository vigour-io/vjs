'use strict'
describe('direct', function () {
  var a
  var Observable = require('../../../../../lib/observable')
  var isEmpty = require('../../../../../lib/util/is/empty')
  // test for cleaning up emitters and bind objects
  it('clears bind objects when emiters get executed', function () {
    a = new Observable({
      key: 'a',
      on: {
        data () {}
      }
    })
    expect(isEmpty(a._on.data.binds)).equals(true)
  })

  it('clear binds when set', function () {
    a.val = 'bla'
    expect(isEmpty(a._on.data.binds)).equals(true)
  })
})
