'use strict'

describe('references', function () {
  var Observable = require('../../../../lib/observable/')
  var isRemoved = require('../../../../lib/util/is/removed')

  it('reference listener fires twice', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        reference () {
          cnt++
        }
      }
    })
    var b = new Observable({
      key: 'b',
      val: 'hello'
    })
    a.val = b
    expect(cnt).to.equal(1)
    a.remove()
    // ref does not fire (is correct did not add yet)
    expect(cnt).to.equal(2)
    expect(isRemoved(a)).to.equal(true)
    expect(b.val).to.equal('hello')
  })

  it('when reference gets removed, set _input to undefined', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          cnt++
        }
      }
    })
    var b = new Observable({
      key: 'b',
      val: 'hello'
    })
    a.val = b
    // b has a listener
    // a has listens
    expect(cnt).to.equal(1)
    b.remove()
    expect(cnt).to.equal(2)
    expect(isRemoved(b)).to.equal(true)
    expect(a._input).to.equal(void 0)
  })
})
