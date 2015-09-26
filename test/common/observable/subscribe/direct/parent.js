/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var count

beforeEach(function () {
  count = 0
})

describe('subscribing to existing parent', function () {
  var a = new Observable({
    key: 'a',
    b: {}
  })
  var parent = new Observable({
    key: 'a-parent',
    a: {
      useVal: a
    }
  })

  it('subcribes to parent on a', function () {
    a.b.subscribe({
      parent: {
        parent: true
      }
    }, function (event, meta) {
      count++
    })
  })

  it("doesn't fire on subscribing", function () {
    expect(count).equals(0)
  })

  it('fires when parent changes', function () {
    parent.val = 1
    expect(count).equals(1)
  })

  it('fires when parent is removed', function () {
    parent.remove()
    expect(count).equals(1)
  })
})

describe('subscribing to nested field on existing parent', function () {
  var a = new Observable({
    key: 'a',
    b: 0,
    c: {
      d: {

      }
    }
  })

  it('subcribes to parent on a', function () {
    a.c.d.subscribe({
      parent: {
        parent: {
          b: true
        }
      }
    }, function (event, meta) {
      count++
    })

    a.b.val = 1

    expect(count).equals(1)
  })

  it('fires when a.b is removed', function () {
    a.b.remove()
    expect(count).equals(1)
  })

  it('fires when a.b is added again', function () {
    a.set({b: true})
    expect(count).equals(1)
  })
})

describe('subscribing to non existing parent', function () {
  var parent
  var a = new Observable({
    key: 'a'
  })

  it('subcribes to parent on a', function () {
    a.subscribe({
      parent: true
    }, function (event, meta) {
      count++
    })
  })

  it("doesn't fire on subscribing", function () {
    expect(count).equals(0)
  })

  it('fires when a is added to parent', function () {
    parent = new Observable({
      blurf: {
        useVal: a
      }
    })
    expect(parent).ok
    expect(count).equals(1)
  })

  it('fires when parent is removed', function () {
    parent.remove()
    expect(count).equals(1)
  })
})
