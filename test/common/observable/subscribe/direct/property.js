'use strict'
/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count

beforeEach(() => {
  count = 0
})

describe('subscribing to self', () => {
  var subscription
  var a = new Observable()
  var ref = new Observable({
    key: 'ref'
  })
  it('subcribes to field', () => {
    subscription = a.subscribe(true, function (event, meta) {
      count++
    })
    expect(count).equals(0)
  })

  it('added a data listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  xit('fires when getting a ref', () => {
    a.val = ref
    expect(count).equals(1)
  })

  xit('fires when changing the ref', () => {
    ref.val = 4
    expect(count).equals(1)
  })
})

describe('subscribing to single existing field', () => {
  var subscription
  var a = new Observable({
    aField: 1
  })

  it('subcribes to field', () => {
    subscription = a.subscribe({
      aField: true
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

  it('fires when field is updated', () => {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is removed', () => {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed data listener and added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when field is added again', () => {
    a.set({
      aField: 3
    })
    expect(count).equals(1)
  })

  it('added data listener and removed property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('unsubscribe => removes all listeners', function () {
    a.unsubscribe()
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(0)
  })
})

describe('subscribing on non-existent field', () => {
  var subscription
  var a = new Observable()

  it('subcribes to field', () => {
    subscription = a.subscribe({
      aField: true
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added a reference and property listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('doesnt fire when calling .run()', () => {
    subscription.run()
    expect(count).equals(0)
  })

  it('fires when field is created', () => {
    a.set({
      aField: true
    })
    expect(count).equals(1)
  })

  it('fires when calling .run()', () => {
    subscription.run()
    expect(count).equals(1)
  })

  it('added data listener and removed property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when field is updated', () => {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is removed', () => {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed data listener and added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when field is added again', () => {
    a.set({
      aField: 3
    })
    expect(count).equals(1)
  })

  it('added data listener and removed property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })
})

describe('subscribing on one non-existent field, one existing field', () => {
  var subscription
  var a = new Observable({
    aField: 1
  })

  it('subcribes to two fields', () => {
    subscription = a.subscribe({
      aField: true,
      anotherField: true
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added data, property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners).contains('data')
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when one field is updated', () => {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when other field is created', () => {
    a.set({
      anotherField: true
    })
    expect(count).equals(1)
  })

  it('added another data listener, removed property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners.numberOf('data')).equals(2)
  })

  it('fires when other field is updated', () => {
    a.anotherField.val = 2
    expect(count).equals(1)
  })

  it('fires once when aField is removed', () => {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed one data listener, added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners).contains('data')
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires once when anotherField is removed', () => {
    a.anotherField.remove()
    expect(count).equals(1)
  })

  it('removed data listener, added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when field is added again', () => {

    a.set({
      aField: 3
    })
    expect(count).equals(1)
  })

  it('added data listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners).contains('data')
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })
})

describe('subscribing on two non-existent fields', () => {
  var subscription
  var a = new Observable()

  it('subcribes to two fields', () => {
    subscription = a.subscribe({
      aField: true,
      anotherField: true
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added a reference and property listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when one field is created', () => {
    a.set({
      aField: true
    })
    expect(count).equals(1)
  })

  it('added data listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners).contains('data')
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when other field is created', () => {
    a.set({
      anotherField: true
    })
    expect(count).equals(1)
  })

  it('added another data listener, removed property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners.numberOf('data')).equals(2)
  })

  it('fires when one field is updated', () => {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when other field is updated', () => {
    a.anotherField.val = 2
    expect(count).equals(1)
  })

  it('fires when one field is removed', () => {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed one data listener, added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners).contains('data')
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when field is added again', () => {
    a.set({
      aField: 3
    })
    expect(count).equals(1)
  })

  it('added data listener, removed property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners.numberOf('data')).equals(2)
  })

  it('fires when other field is updated', () => {
    a.anotherField.val = 3
    expect(count).equals(1)
  })
})

describe('subscribing on existent nested field', () => {
  var subscription
  var a = new Observable({
    aField: {
      anotherField: 1
    }
  })

  it('subcribes to nested field', () => {

    subscription = a.subscribe({
      aField: {
        anotherField: true
      }
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added a data listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when nested field is updated', () => {
    a.aField.anotherField.val = 2
    expect(count).equals(1)
  })

  it('fires when parent field is removed', () => {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('does not fire when parent field is added again', () => {
    a.set({
      aField: 3
    })
    expect(count).equals(0)
  })

  it('moved property listener and added reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners.numberOf('reference')).equals(2)
    expect(listeners).contains('property')
  })

  it('fires when nested field is added again', () => {
    a.aField.set({
      anotherField: 1
    })
    expect(count).equals(1)
  })

  it('added data listener, removed all other listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })
})


describe('subscribing on super nested field', () => {
  var subscription
  var a = new Observable({
    aField: {
      anotherField: {
        nestedOne: {
          nestedTwo: true
        }
      }
    }
  })

  it('subcribes to nested field', () => {

    subscription = a.subscribe({
      aField: {
        anotherField: {
          nestedOne: {
            nestedTwo: true
          }
        }
      }
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added a data listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when nested field is updated', () => {
    a.aField.anotherField.nestedOne.nestedTwo.val = 2
    expect(count).equals(1)
  })

  it('fires when parent field is removed', () => {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('does not fire when parent field is added again', () => {
    a.set({
      aField: 3
    })
    expect(count).equals(0)
  })

  it('moved property listener and added reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners.numberOf('reference')).equals(2)
    expect(listeners).contains('property')
  })

  it('fires when nested field is added again', () => {
    a.aField.set({
      anotherField: {
        nestedOne: {
          nestedTwo: 1
        }
      }
    })
    expect(count).equals(1)
  })

  it('added data listener, removed all other listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })
})


describe('subscribing on non-existent nested field in existing field', () => {
  var subscription
  var a = new Observable({
    aField: true
  })

  it('subcribes to nested field', () => {
    subscription = a.subscribe({
      aField: {
        anotherField: true
      }
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added one property and two reference listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners.numberOf('reference')).equals(2)
    expect(listeners).contains('property')
  })

  it('fires when nested field is created', () => {
    a.aField.set({
      anotherField: true
    })
    expect(count).equals(1)
  })

  it('added data listener and removed other listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when nested field is updated', () => {
    a.aField.anotherField.val = 2
    expect(count).equals(1)
  })

  it('fires when parent field is removed', () => {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed data listener, added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('does not fire when parent field is added again', () => {
    a.set({
      aField: 3
    })
    expect(count).equals(0)
  })

  it('moved property listener and added another reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners.numberOf('reference')).equals(2)
    expect(listeners).contains('property')
  })

  it('fires when nested field is added again', () => {
    a.aField.set({
      anotherField: 1
    })
    expect(count).equals(1)
  })

  it('added data listener and removed other listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })
})

describe('subscribe on non-existent nested field in non-existent field', () => {
  var subscription
  var a = new Observable()

  it('subcribes to nested field', () => {
    subscription = a.subscribe({
      aField: {
        anotherField: true
      }
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it("doesn't fire on setting top level field", () => {
    a.set({
      aField: true
    })
    expect(count).equals(0)
  })

  it('added another reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners.numberOf('reference')).equals(2)
    expect(listeners).contains('property')
  })

  it('fires when nested field is created', () => {
    a.aField.set({
      anotherField: true
    })
    expect(count).equals(1)
  })

  it('added data listener and removed other listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when nested field is updated', () => {
    a.aField.anotherField.val = 2
    expect(count).equals(1)
  })

  it('fires when parent field is removed', () => {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed data listener, added property and reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('does not fire when parent field is added again', () => {
    a.set({
      aField: 3
    })
    expect(count).equals(0)
  })

  it('added another reference listener', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(3)
    expect(listeners.numberOf('reference')).equals(2)
    expect(listeners).contains('property')
  })

  it('fires when nested field is added again', () => {
    a.aField.set({
      anotherField: 1
    })
    expect(count).equals(1)
  })

  it('added data listener and removed other listeners', () => {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })
})
