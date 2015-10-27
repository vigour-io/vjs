'use strict'
describe('property listener', function () {
  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  var a = new Observable({
    key: 'a',
    on: {
      property: function () {
        cnt++
      }
    }
  })
  var aInstance // eslint-disable-line
  it('create instance, listener does not fire', function () {
    aInstance = new a.Constructor({
      key: 'aInstance'
    })
    expect(cnt).to.equal(0)
  })

  it('listener fired 2 times', function () {
    a.set({
      c: true
    })
    expect(cnt).to.equal(2)
  })
})

describe('property listener on instance', function () {
  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  var a = new Observable({
    key: 'a',
    on: {}
    // trackInstances: true
  })

  var aInstance = new a.Constructor({ // eslint-disable-line
    key: 'aInstance',
    on: {
      property () {
        cnt++
      }
    }
  })

  it('listener fires when updating class', function () {
    console.clear()
    a.set({
      c: true
    })
    expect(cnt).to.equal(1)
  })
})
