'use strict'
describe('property listener', function () {
  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  var a = new Observable({
    key: 'a',
    on: {
      property () {
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
    on: {} // remove track instances needs empty on object way cleaner
    // on: {
    //   property () {} // so this is a problem... instances but no emitter...
    // }
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
    a.set({
      c: true
    })
    expect(cnt).to.equal(1)
  })
})

describe('property listener on class fires on instance', function () {
  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  var a = new Observable({
    key: 'a',
    on: {
      property () {
        cnt++
      }
    }
    // trackInstances: true
  })

  var aInstance = new a.Constructor({ // eslint-disable-line
    key: 'aInstance'
  })

  it('listener fires on both class and instance when updating class', function () {
    a.set({
      c: true
    })
    expect(cnt).to.equal(2)
  })
})

describe('nested property listener on class fires on instance', function () {
  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  var a = new Observable({
    key: 'a',
    trackInstances: true,
    nested: {
      on: {
        property () {
          cnt++
        }
      }
    }
  })

  var aInstance = new a.Constructor({ // eslint-disable-line
    key: 'aInstance'
  })

  it('listener fires on both class and instance when updating class', function () {
    a.nested.set({
      c: true
    })
    expect(cnt).to.equal(2)
  })
})
