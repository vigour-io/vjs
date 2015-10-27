/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count

beforeEach(function () {
  count = 0
})

describe('subscribing to existing parent', function () {
  var subscription
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
    subscription = a.b.subscribe({
      parent: {
        parent: true
      }
    }, function (event, meta) {
      count++
    })
    expect(count).equals(0)
  })

  it('added a data listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when parent changes', function () {
    parent.val = 1
    expect(count).equals(1)
  })

  it('fires when parent is removed', function () {
    parent.remove()
    expect(count).equals(1)
  })

  it('removed all listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(0)
  })
})

describe('subscribing to nested field on existing parent', function () {
  var subscription
  var a = new Observable({
    key: 'a',
    b: 0,
    c: {
      d: {

      }
    }
  })

  it('subcribes to parent on a', function () {
    subscription = a.c.d.subscribe({
      parent: {
        parent: {
          b: true
        }
      }
    }, function (event, meta) {
      count++
    })

    expect(count).equals(0)
  })

  it('added a data listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when a.b changes', function () {
    a.b.val = 1
    expect(count).equals(1)
  })

  it('fires when a.b is removed', function () {
    a.b.remove()
    expect(count).equals(1)
  })

  it('added a reference and property listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(4)
    expect(listeners.numberOf('reference')).equals(3)
    expect(listeners).contains('property')
  })

  it('fires when a.b is added again', function () {
    a.set({
      b: true
    })
    expect(count).equals(1)
  })

  it('added a data listener, removed other listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })
})

describe('subscribing to non existing parent', function () {
  var parent
  var subscription
  var a = new Observable({
    key: 'a'
  })

  it('subcribes to parent on a', function () {
    subscription = a.subscribe({
      parent: true
    }, function (event, meta) {
      count++
    })
    expect(count).equals(0)
  })

  it('added parent and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('parentEmitter')
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

  it('added a data listener, keeps parent listener (for potential instances) and keeps reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners).contains('data')
    expect(listeners).contains('reference')
    expect(listeners).contains('parentEmitter')
  })

  it('fires when parent is removed', function () {
    parent.remove()
    expect(count).equals(1)
  })

  it('removed all listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(0)
  })
})
