/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count
var instance

beforeEach(() => {
  count = 0
})

describe('subscribing to same parent with multiple instances', function () {
  var keys = []
  var a = new Observable({
    key: 'a'
  })
  var b
  it('subcribes to field', function () {
    a.subscribe({
      parent: {
        field: true
      }
    }, function () {
      keys.push(this.key)
      count++
    })

    b = new a.Constructor({
      key: 'b'
    })
    expect(count).equals(0)
  })

  it('fires on instance', function () {
    new Observable({
      field: 1,
      a: {
        useVal: a
      },
      b: {
        useVal: b
      }
    })
    expect(count).equals(2)
    expect(keys).contains('a')
    expect(keys).contains('b')
  })
})

describe('subscribing to same parent with more instances', function () {
  var keys = []

  var a = new Observable({
    trackInstances: true,
    key: 'a'
  })

  it('subcribes to field', function () {
    a.subscribe({
      parent: {
        field: true
      }
    }, function () {
      keys.push(this.key)
      count++
    })
  })

  var b = new a.Constructor({
    key: 'b'
  })

  var c = new b.Constructor({
    key: 'c'
  })

  var d = new c.Constructor({
    key: 'd'
  })

  it('fires on instance', function () {
    new Observable({
      field: 1,
      a: {
        useVal: a
      },
      b: {
        useVal: b
      },
      c: {
        useVal: c
      },
      d: {
        useVal: d
      }
    })
    expect(count).equals(4)
    expect(keys).contains('a')
    expect(keys).contains('b')
    expect(keys).contains('c')
    expect(keys).contains('d')
  })
})
