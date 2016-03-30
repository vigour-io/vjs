var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count

beforeEach(() => {
  count = 0
})

describe('subscribing to own reference', () => {
  var subscription
  var ref = new Observable()
  var a = new Observable(ref)

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

  it('fires when updated', () => {
    ref.val = 1
    expect(count).equals(1)
  })
})

describe('subscribing to single existing field, existing reference', () => {
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

  it('subcribes to field', () => {
    subscription = c.subscribe({
      aField: true
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added property and reference listener on c', () => {
    var listeners = testListeners(c)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('added property and reference listener on b', () => {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('added no listeners on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equal(0)
  })

  it('added data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('fires when field is updated on referenced obj', () => {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is created on obj', () => {
    b.set({
      aField: true
    })
    expect(count).equals(1)
  })

  it('added data listener on b.aField', () => {
    var listeners = testListeners(b.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('removed data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(0)
  })

  it('removed property listener on b', () => {
    var listeners = testListeners(b)
    expect(listeners.length).equal(0)
  })

  it('doesn\'t fire when field is updated on referenced obj', () => {
    a.aField.val = 3
    expect(count).equals(0)
  })

  it('removing b.aField fires subscription', () => {
    b.aField.remove()
    expect(count).equals(1)
  })

  it('added data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('added property on b', () => {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })
})

describe('subscribing to existing field, and non existing field, existing reference', () => {
  var subscription
  var a = new Observable({
    aField: 1
  })
  var b = new Observable(a)

  it('subcribes to two fields', () => {
    subscription = b.subscribe({
      aField: true,
      bField: true
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added property and reference listener on b', () => {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('added property and reference listener on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('added data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('fires when field is updated on referenced obj', () => {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is created on obj', () => {
    b.set({
      aField: true
    })
    expect(count).equals(1)
  })

  it('added data listener on b.aField', () => {
    var listeners = testListeners(b.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('removed data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(0)
  })

  it('keeps listeners on b', () => {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('keeps listeners on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('doesn\'t fire when field is updated on referenced obj', () => {
    a.aField.val = 3
    expect(count).equals(0)
  })

  it('fires when field is created on obj', () => {
    b.set({
      bField: true
    })
    expect(count).equals(1)
  })

  it('added data listener on b.bField', () => {
    var listeners = testListeners(b.bField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('removed property and reference listener on b', () => {
    var listeners = testListeners(b)
    expect(listeners.length).equal(0)
  })
})

describe('subscribing to single existing field, existing reference, switch reference', () => {
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

  it('subcribes to field', () => {
    subscription = b.subscribe({
      aField: true
    }, () => {
      count++
    })
    expect(count).equals(0)
  })

  it('added data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

  it('added property on b', () => {
    var listeners = testListeners(b)
    expect(listeners.length).equal(2)
    expect(listeners).contains('property')
    expect(listeners).contains('reference')
  })

  it('changing the reference to c, fires the sub', () => {
    b.val = c
    expect(count).equals(1)
  })

  it('removed listeners on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equal(0)
  })

  it('added data listener on c.aField', () => {
    var listeners = testListeners(c.aField)
    expect(listeners.length).equal(1)
    expect(listeners).contains('data')
  })

})
