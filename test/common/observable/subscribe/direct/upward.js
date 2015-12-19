'use strict'
/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count

beforeEach(() => {
  count = 0
})

describe('subscribing to non existing $upward, two levels, nested field', () => {
  var a = new Observable({key:'a'})
  var subscription
  var grandParent
  var parent

  it('subcribes to parent on a', () => {
    console.clear()
    subscription = a.subscribe({
      $upward: {
        field: true
      }
    }, function (event, meta) {
      count++
    })
    expect(count).equals(0)
  })

  it('added a property, reference and parent listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
    expect(listeners).contains('parentEmitter')
  })

  it('fires when added to parent', () => {
    parent = new Observable({
      field: true,
      a: {
        useVal: a
      }
    })
    expect(count).equals(1)
  })

  it('added a data listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(4)
    expect(listeners).contains('data')
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
    expect(listeners).contains('parentEmitter')
  })

  it('does not fire when parent is added to grandparent', () => {
    grandParent = new Observable({
      field: true,
      p: {
        useVal: parent
      }
    })
    expect(count).equals(0)
  })

  it('listeners remain the same', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(4)
    expect(listeners).contains('data')
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
    expect(listeners).contains('parentEmitter')
  })
})

describe('subscribing to non existing $upward, two levels, multiple nested fields', () => {
  var a = new Observable()
  var subscription
  var grandParent
  var parent

  it('subcribes to parent on a', () => {
    subscription = a.subscribe({
      $upward: {
        field: true,
        power: true
      }
    }, function (data, event) {
      count++
    })
    expect(count).equals(0)
  })

  it('added a property, reference and parent listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
    expect(listeners).contains('parentEmitter')
  })

  it('fires when added to parent', () => {
    parent = new Observable({
      field: true,
      a: {
        useVal: a
      }
    })
    expect(count).equals(1)
  })

  it('added a data, property, reference and parent listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(7)
    expect(listeners).contains('data')
    expect(listeners.numberOf('property')).equals(2)
    expect(listeners.numberOf('reference')).equals(2)
    expect(listeners.numberOf('parentEmitter')).equals(2)
  })

  it('does not fire when parent is added to grandparent', () => {
    grandParent = new Observable({
      field: true,
      p: {
        useVal: parent
      }
    })
    expect(count).equals(0)
  })

  it('added reference, parent and property listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(10)
    expect(listeners).contains('data')
    expect(listeners.numberOf('property')).equals(3)
    expect(listeners.numberOf('reference')).equals(3)
    expect(listeners.numberOf('parentEmitter')).equals(3)
  })

  it('fires when power is added to grandParent',() => {
    grandParent.set({
      power:true
    })
    expect(count).equals(1)
  })

  it('added data listener, removed property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(9)
    expect(listeners.numberOf('data')).equals(2)
    expect(listeners.numberOf('property')).equals(2)
    expect(listeners.numberOf('reference')).equals(2)
    expect(listeners.numberOf('parentEmitter')).equals(3)
  })
})

describe('subscribing to rendered', () => {
  var a = new Observable()
  var parent

  it('subcribes to parent on a', () => {
    a.subscribe({
      $upward: {
        rendered: true
      }
    }, function (event, meta) {
      count++
    })
  })

  it('does not fire when added to parent (loop)', () => {
    for (var i = 10; i >= 0; i--) {
      parent = new Observable({
        a: {
          useVal: a
        }
      })
      a = parent
    }
    expect(count).equals(0)
  })

  it('fires when rendered set to true', () => {
    parent.set({
      rendered: true
    })
    expect(count).equals(1)
  })
})
