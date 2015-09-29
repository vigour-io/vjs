var Observable = require('../../../../../../lib/observable')
var subcription
var change
var property
var count

beforeEach(function () {
  count = 0

  if (subcription) {
    subcription.listensOnAttach.each(function (p) {
      if (p.key === 'data') {
        change = p.attach
      }
      if (p.key === 'property') {
        property = p.attach
      }
    })
  }

})

describe('subscribing to single existing field, existing reference', function () {
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
    try {
      subcription = c.subscribe({
        aField: true
      }, function () {
        count++
      })
    } catch(e) {
  
    }
  })

  it('has added a change listener on a.aField', function () {
    expect(a.aField._on.data).ok
  })

  it('has added a property listener on b', function () {
    expect(b._on.property).ok
  })

  it('has not added a property listener on a', function () {
    expect(a._on.property).not.ok
  })

  it("doesn't fire on subscribing", function () {
    expect(count).equals(0)
  })

  it('fires when field is updated on referenced obj', function () {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is created on obj', function () {
    b.set({aField: true})
    expect(count).equals(1)
  })

  it('has added a change listener on b.aField', function () {
    expect(b.aField._on.data).ok
  })

  it('has removed the change listener on a.aField', function () {
    expect(a.aField._on.data.attach).not.ok
  })

  it('has removed the property listener on b', function () {
    expect(b._on.property.attach).not.ok
  })

  it("doesn't fire when field is updated on referenced obj", function () {
    a.aField.val = 3
    expect(count).equals(0)
  })

  it('removing b.aField adds a change listener to a.aField', function () {
    b.aField.remove()
    expect(a.aField._on.data.attach).ok
  })

  it('and adds a property listener to b', function () {
    expect(b._on.property.attach).ok
  })
})

describe('subscribing to existing field, and non existing field, existing reference', function () {
  var a = new Observable({
    aField: 1
  })
  var b = new Observable(a)

  it('subcribes to two fielda', function () {
    subcription = b.subscribe({
      aField: true,
      bField: true
    }, function () {
      count++
    })
  })

  it('has added a change listener on a.aField', function () {
    expect(a.aField._on.data).ok
  })

  it('has added a property listener on a', function () {
    expect(a._on.property).ok
  })

  it('has added a property listener on b', function () {
    expect(b._on.property).ok
  })

  it("doesn't fire on subscribing", function () {
    expect(count).equals(0)
  })

  it('fires when field is updated on referenced obj', function () {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is created on obj', function () {
    b.set({aField: true})
    expect(count).equals(1)
  })

  it('has added a change listener on b.aField', function () {
    expect(b.aField._on.data).ok
  })

  it('has removed the change listener on a.aField', function () {
    expect(a.aField._on.data.attach).not.ok
  })

  it('has not removed the property listener on b', function () {
    expect(b._on.property.attach).ok
  })

  it("doesn't fire when field is updated on referenced obj", function () {
    a.aField.val = 3
    expect(count).equals(0)
  })

  it('fires when field is created on obj', function () {
    b.set({bField: true})
    expect(count).equals(1)
  })

  it('has added a change listener on b.aField', function () {
    expect(b.bField._on.data).ok
  })

  it('has removed the property listener on b', function () {
    expect(b._on.property.attach).not.ok
  })
})

describe('subscribing to single existing field, existing reference, switch reference', function () {
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
    subcription = b.subscribe({
      aField: true
    }, function () {
      count++
    })
  })

  it('has added a change listener on a.aField', function () {
    expect(a.aField._on.data).ok
  })

  it('has added a property listener on b', function () {
    expect(b._on.property).ok
  })

  it('has not added a property listener on a', function () {
    expect(a._on.property).not.ok
  })

  it("doesn't fire on subscribing", function () {
    expect(count).equals(0)
  })

  it('changing the reference to c, fires the sub', function () {
    b.val = c
    expect(count).equals(1)
  })

  it('has removed listeners on a', function () {
    expect(a.aField._on.data.attach).not.ok
  })

  it('has added a change listener on c.aField', function () {
    expect(c.aField._on.data).ok
  })

})
