var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(() => {
  countOne = 0
  countTwo = 0
})

describe('removing before the subscription is found: adding prop listeners', function () {
  var sub
  var a = new Observable({
    nested: {}
  })

  it('subscribes to field', function () {
    a.subscribe({
      nested: {
        title: true
      }
    }, function () {
      countOne++
    })
    expect(countOne).equals(0)
  })

  it('doesnt fire when removing', function () {
    a.nested.remove()
    expect(countOne).equals(0)
  })

  it('fires when adding nested title', function () {
    a.set({
      nested: {
        title: 'foo'
      }
    })
    expect(countOne).equals(1)
  })
})

describe('removing before the subscription is found: adding prop listeners, reference', function () {
  var sub
  var a = new Observable(new Observable({
    nested:{}
  }))

  it('subscribes to field', function () {
    a.subscribe({
      nested: {
        title: true
      }
    }, function () {
      countOne++
    })
    expect(countOne).equals(0)
  })

  it('doesnt fire when removing', function () {
    a.val.nested.remove()
    expect(countOne).equals(0)
  })

  it('fires when adding nested title', function () {
    a.set({
      nested: new Observable({
        title: 'foo'
      })
    })
    expect(countOne).equals(1)
  })
})