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

  it('fires when calling .run()', () => {
    subscription.run()
    expect(count).equals(1)
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

  it('fires when calling .run()', () => {
    subscription.run()
    expect(count).equals(1)
  })

  it('fires when a.b changes', function () {
    a.b.val = 1
    expect(count).equals(1)
  })

  it('fires when a.b is removed', function () {
    console.log('------remove!')
    a.b.remove()
    expect(count).equals(1)
  })

  it('added a reference and property listener', () => {
    var listeners = testListeners(subscription)
    console.log('------')
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

  it('added a data listener, keeps parent listener (for potential instances) and removes reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('data')
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

describe('subscribing to parent from multiple subscribers', function () {
  var count1 = 0
  var count2 = 0
  var a = new Observable({
    key: 'a',
    field1: true,
    field2: true,
    child1: {},
    child2: {
      nested: {

      }
    }
  })

  it('subcribes to parent.field on a.child1 and a.child2', function () {
    a.child1.subscribe({
      parent: {
        field1: true
      }
    }, function (event, meta) {
      count1++
    })

    a.child2.nested.subscribe({
      parent: {
        parent: {
          field2: true
        }
      }
    }, function (event, meta) {
      count2++
    })
  })

  it('added parent and reference listener', () => {
    a.field1.val = 1
    a.field2.val = 2
    expect(count1).equals(1)
    expect(count2).equals(1)
  })
})

describe('subscribing to parent from multiple subscribers, reference', function () {
  var count1 = 0
  var count2 = 0
  var ref = new Observable({
    field1: true,
    field2: true
  })
  var a = new Observable({
    val: ref,
    key: 'a',
    child1: {},
    child2: {
      nested: {

      }
    }
  })

  it('subcribes to parent.field on a.child1 and a.child2', function () {
    a.child1.subscribe({
      parent: {
        field1: true
      }
    }, function (event, meta) {
      count1++
    })

    a.child2.nested.subscribe({
      parent: {
        parent: {
          field2: true
        }
      }
    }, function (event, meta) {
      count2++
    })
  })

  it('added parent and reference listener', () => {
    ref.field1.val = 1
    ref.field2.val = 2
    expect(count1).equals(1)
    expect(count2).equals(1)
  })
})

describe('subscribing to parent from multiple subscribers, reference 2', function () {
  var count1 = 0
  var count2 = 0

  var ref = new Observable({
    field1: true,
    field2: true
  })

  var a = new Observable({
    key: 'a',
    child1: {},
    child2: {
      nested: {

      }
    }
  })

  it('subcribes to parent.field on a.child1 and a.child2', function () {
    a.child1.subscribe({
      parent: {
        field1: true
      }
    }, function (event, meta) {
      count1++
    })

    a.child2.nested.subscribe({
      parent: {
        parent: {
          field2: true
        }
      }
    }, function (event, meta) {
      count2++
    })

  })

  it('fires for both', () => {
    a.set(ref)
    expect(count1).equals(1)
    expect(count2).equals(1)
  })
})

describe('subscribing to parent from multiple subscribers, reference, instances', function () {
  var count1 = 0
  var count2 = 0
  var ref = new Observable({
    field1: true,
    field2: true
  })
  var a = new Observable()
  var child1 = new Observable()
  var child2 = new Observable({
    nested: {}
  })

  it('subcribes to parent.field on child1 and child2', function () {
    child1.subscribe({
      parent: {
        field1: true
      }
    }, function (event, meta) {
      count1++
    })
    child2.nested.subscribe({
      parent: {
        parent: {
          field2: true
        }
      }
    }, function (event, meta) {
      count2++
    })
  })

  it('added parent and reference listener', () => {
    a.set({
      val: ref,
      child1set: {
        useVal: new child1.Constructor()
      },
      child2set: {
        useVal: new child2.Constructor()
      }
    })
    expect(count1).equals(1)
    expect(count2).equals(1)
  })
})
