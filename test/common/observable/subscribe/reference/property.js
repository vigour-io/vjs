'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count

beforeEach(function () {
  count = 0
})

describe('subscribing to own reference', function () {
  var subscription
  var ref = new Observable()
  var a = new Observable(ref)

  it('subcribes to field', function () {
    subscription = a.subscribe(true, function (event, meta) {
      count++
    })
    expect(count).equals(0)
  })

  it('added a data listener', function () {
    var listeners = testListeners(subscription)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when updated', function () {
    ref.val = 1
    expect(count).equals(1)
  })
})

describe('subscribing to single existing field, existing reference', function () {
  var subscription
  var a = new Observable({
    key: 'a',
    aField: 1
  })

  var b = new Observable({
    key: 'b',
    val: a
  })

  var c = new Observable({
    key: 'c',
    val: b
  })

  it('subcribes to field', function () {
    subscription = c.subscribe({
      aField: true
    }, function () {
      count++
    })
    expect(count).equals(0)
  })

  it('added property and reference listener on c', function () {
    var listeners = testListeners(c)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('added property and reference listener on b', function () {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('added no listeners on a', function () {
    var listeners = testListeners(a)
    expect(listeners.length).equal(0)
  })

  it('added data listener on a.aField', function () {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('fires when field is updated on referenced obj', function () {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is created on obj', function () {
    b.set({
      aField: true
    })
    expect(count).equals(1)
  })

  it('added data listener on b.aField', function () {
    var listeners = testListeners(b.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('removed data listener on a.aField', function () {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(0)
  })

  it('removed property listener on b', function () {
    var listeners = testListeners(b)
    expect(listeners.length).equal(0)
  })

  it('doesn\'t fire when field is updated on referenced obj', function () {
    a.aField.val = 3
    expect(count).equals(0)
  })

  it('removing b.aField fires subscription', function () {
    b.aField.remove()
    expect(count).equals(1)
  })

  it('added data listener on a.aField', function () {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('added property on b', function () {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })
})

describe('subscribing to existing field, and non existing field, existing reference', function () {
  var subscription
  var a = new Observable({
    aField: 1
  })
  var b = new Observable(a)

  it('subcribes to two fields', function () {
    subscription = b.subscribe({
      aField: true,
      bField: true
    }, function () {
      count++
    })
    expect(count).equals(0)
  })

  it('added property and reference listener on b', function () {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('added property and reference listener on a', function () {
    var listeners = testListeners(a)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('added data listener on a.aField', function () {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('fires when field is updated on referenced obj', function () {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is created on obj', function () {
    b.set({
      aField: true
    })
    expect(count).equals(1)
  })

  it('added data listener on b.aField', function () {
    var listeners = testListeners(b.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('removed data listener on a.aField', function () {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(0)
  })

  it('keeps listeners on b', function () {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('keeps listeners on a', function () {
    var listeners = testListeners(a)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('doesn\'t fire when field is updated on referenced obj', function () {
    a.aField.val = 3
    expect(count).equals(0)
  })

  it('fires when field is created on obj', function () {
    b.set({
      bField: true
    })
    expect(count).equals(1)
  })

  it('added data listener on b.bField', function () {
    var listeners = testListeners(b.bField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('removed property and reference listener on b', function () {
    var listeners = testListeners(b)
    expect(listeners.length).equal(0)
  })
})

describe('subscribing to single existing field, existing reference, switch reference', function () {
  var subscription
  var a = new Observable({
    key: 'a',
    aField: 1
  })
  var c = new Observable({
    key: 'c',
    aField: 1
  })
  var b = new Observable({
    key: 'b',
    val: a
  })

  it('subcribes to field', function () {
    subscription = b.subscribe({
      aField: true
    }, function () {
      count++
    })
    expect(count).equals(0)
  })

  it('added data listener on a.aField', function () {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('added property on b', function () {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('changing the reference to c, fires the sub', function () {
    b.val = c
    expect(count).equals(1)
  })

  it('removed listeners on a', function () {
    var listeners = testListeners(a)
    expect(listeners.length).equal(0)
  })

  it('added data listener on c.aField', function () {
    var listeners = testListeners(c.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

})

describe('subscribe on nested field', function () {
  var subscription
  var ref = new Observable({
    key: 'ref',
    nested:{}
  })
  var b = new Observable({
    key:'b',
    val:ref
  })

  it('subscribes to field', function () {
    subscription = b.subscribe({
      nested:{
        aField: true
      }
    }, function () {
      count++
    })
    expect(count).equals(0)
  })

  it('fires when field is added on ref.nested', function () {
    ref.nested.set({
      aField: 'foo'
    })
    expect(count).equals(1)
  })
})