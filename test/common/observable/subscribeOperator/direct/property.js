/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
Observable.prototype.inject(require('../../../../../lib/operator/subscribe'))
var testListeners = require('../testListeners')

describe('subscribing to single existing field', () => {
  var a = new Observable({
    aField: 1,
    $:'aField'
  })

  it('added a data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('output of subscriber equals sub', ()=> {
    expect(a.val).equals(a.aField.val)
  })

  it('updates when field is updated', () => {
    a.aField.val = 2
    expect(a.val).equals(2)
  })

  it('updates when field is removed', () => {
    a.aField.remove()
    expect(a.val).equals(null)
  })

  it('added property and reference listener on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('updates when field is added again', () => {
    a.set({
      aField: 3
    })
    expect(a.val).equals(3)
  })

  it('added a data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('removed property and reference listener on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equals(0)
  })
})

describe('subscribing on non-existent field', () => {
  var a = new Observable({
    $:'aField'
  })

  it('added a reference and property listener on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('updates when field is created', () => {
    a.set({
      aField:1
    })
    expect(a.val).equals(1)
  })

  it('added a data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('removed property and reference listener on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equals(0)
  })

  it('updates when field is updated', () => {
    a.aField.val = 2
    expect(a.val).equals(2)
  })

  it('updates when field is removed', () => {
    a.aField.remove()
    expect(a.val).equals(null)
  })

  it('added a reference and property listener on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })
})

describe('subscribing on one non-existent field, one existing field', () => {
  var a = new Observable({
    aField: 1,
    $:{
      aField:true,
      anotherField:true
    }
  })

  it('added a data listener on a.aField', () => {
    var listeners = testListeners(a.aField)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('added a reference and property listener on a', () => {
    var listeners = testListeners(a)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('updates when field is updated', () => {
    a.aField.val = 2
    expect(a.val).equals(2)
  })

  it('updates when the other field is created', () => {
    a.set({
      anotherField:3
    })
    expect(a.val).equals(3)
  })

  // it('added another data listener, removed property and reference listener', () => {
  //   var listeners = testListeners(subscription)
  //   expect(listeners.length).equals(2)
  //   expect(listeners.numberOf('data')).equals(2)
  // })

  // it('fires when other field is updated', () => {
  //   a.anotherField.val = 2
  //   expect(count).equals(1)
  // })

  // it('fires once when aField is removed', () => {
  //   a.aField.remove()
  //   expect(count).equals(1)
  // })

  // it('removed one data listener, added property and reference listener', () => {
  //   var listeners = testListeners(subscription)
  //   expect(listeners.length).equals(3)
  //   expect(listeners).contains('data')
  //   expect(listeners).contains('reference')
  //   expect(listeners).contains('property')
  // })

  // it('fires once when anotherField is removed', () => {
  //   a.anotherField.remove()
  //   expect(count).equals(1)
  // })

  // it('removed data listener, added property and reference listener', () => {
  //   var listeners = testListeners(subscription)
  //   expect(listeners.length).equals(2)
  //   expect(listeners).contains('reference')
  //   expect(listeners).contains('property')
  // })

  // it('fires when field is added again', () => {
  //   a.set({
  //     aField: 3
  //   })
  //   expect(count).equals(1)
  // })

  // it('added data listener', () => {
  //   var listeners = testListeners(subscription)
  //   expect(listeners.length).equals(3)
  //   expect(listeners).contains('data')
  //   expect(listeners).contains('reference')
  //   expect(listeners).contains('property')
  // })
})

// describe('subscribing on two non-existent fields', () => {
//   var subscription
//   var a = new Observable()

//   it('subcribes to two fields', () => {
//     subscription = a.subscribe({
//       aField: true,
//       anotherField: true
//     }, () => {
//       count++
//     })
//     expect(count).equals(0)
//   })

//   it('added a reference and property listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(2)
//     expect(listeners).contains('reference')
//     expect(listeners).contains('property')
//   })

//   it('fires when one field is created', () => {
//     a.set({
//       aField: true
//     })
//     expect(count).equals(1)
//   })

//   it('added data listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(3)
//     expect(listeners).contains('data')
//     expect(listeners).contains('reference')
//     expect(listeners).contains('property')
//   })

//   it('fires when other field is created', () => {
//     a.set({
//       anotherField: true
//     })
//     expect(count).equals(1)
//   })

//   it('added another data listener, removed property and reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(2)
//     expect(listeners.numberOf('data')).equals(2)
//   })

//   it('fires when one field is updated', () => {
//     a.aField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when other field is updated', () => {
//     a.anotherField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when one field is removed', () => {
//     a.aField.remove()
//     expect(count).equals(1)
//   })

//   it('removed one data listener, added property and reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(3)
//     expect(listeners).contains('data')
//     expect(listeners).contains('reference')
//     expect(listeners).contains('property')
//   })

//   it('fires when field is added again', () => {
//     a.set({
//       aField: 3
//     })
//     expect(count).equals(1)
//   })

//   it('added data listener, removed property and reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(2)
//     expect(listeners.numberOf('data')).equals(2)
//   })

//   it('fires when other field is updated', () => {
//     a.anotherField.val = 3
//     expect(count).equals(1)
//   })
// })

// describe('subscribing on existent nested field', () => {
//   var subscription
//   var a = new Observable({
//     aField: {
//       anotherField: 1
//     }
//   })

//   it('subcribes to nested field', () => {
//     
//     subscription = a.subscribe({
//       aField: {
//         anotherField: true
//       }
//     }, () => {
//       count++
//     })
//     expect(count).equals(0)
//   })

//   it('added a data listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(1)
//     expect(listeners).contains('data')
//     console.log('-------')
//   })

//   it('fires when nested field is updated', () => {
//     a.aField.anotherField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when parent field is removed', () => {
//     a.aField.remove()
//     expect(count).equals(1)
//   })

//   it('added property and reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(2)
//     expect(listeners).contains('reference')
//     expect(listeners).contains('property')
//   })

//   it('does not fire when parent field is added again', () => {
//     a.set({
//       aField: 3
//     })
//     expect(count).equals(0)
//   })

//   it('moved property listener and added reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(3)
//     expect(listeners.numberOf('reference')).equals(2)
//     expect(listeners).contains('property')
//   })

//   it('fires when nested field is added again', () => {
//     a.aField.set({
//       anotherField: 1
//     })
//     expect(count).equals(1)
//   })

//   it('added data listener, removed all other listeners', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(1)
//     expect(listeners).contains('data')
//   })
// })

// describe('subscribing on non-existent nested field in existing field', () => {
//   var subscription
//   var a = new Observable({
//     aField: true
//   })

//   it('subcribes to nested field', () => {
//     subscription = a.subscribe({
//       aField: {
//         anotherField: true
//       }
//     }, () => {
//       count++
//     })
//     expect(count).equals(0)
//   })

//   it('added one property and two reference listeners', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(3)
//     expect(listeners.numberOf('reference')).equals(2)
//     expect(listeners).contains('property')
//   })

//   it('fires when nested field is created', () => {
//     a.aField.set({
//       anotherField: true
//     })
//     expect(count).equals(1)
//   })

//   it('added data listener and removed other listeners', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(1)
//     expect(listeners).contains('data')
//   })

//   it('fires when nested field is updated', () => {
//     a.aField.anotherField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when parent field is removed', () => {
//     a.aField.remove()
//     expect(count).equals(1)
//   })

//   it('removed data listener, added property and reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(2)
//     expect(listeners).contains('reference')
//     expect(listeners).contains('property')
//   })

//   it('does not fire when parent field is added again', () => {
//     a.set({
//       aField: 3
//     })
//     expect(count).equals(0)
//   })

//   it('moved property listener and added another reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(3)
//     expect(listeners.numberOf('reference')).equals(2)
//     expect(listeners).contains('property')
//   })

//   it('fires when nested field is added again', () => {
//     a.aField.set({
//       anotherField: 1
//     })
//     expect(count).equals(1)
//   })

//   it('added data listener and removed other listeners', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(1)
//     expect(listeners).contains('data')
//   })
// })

// describe('subscribe on non-existent nested field in non-existent field', () => {
//   var subscription
//   var a = new Observable()

//   it('subcribes to nested field', () => {
//     subscription = a.subscribe({
//       aField: {
//         anotherField: true
//       }
//     }, () => {
//       count++
//     })
//     expect(count).equals(0)
//   })

//   it('added property and reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(2)
//     expect(listeners).contains('reference')
//     expect(listeners).contains('property')
//   })

//   it("doesn't fire on setting top level field", () => {
//     a.set({
//       aField: true
//     })
//     expect(count).equals(0)
//   })

//   it('added another reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(3)
//     expect(listeners.numberOf('reference')).equals(2)
//     expect(listeners).contains('property')
//   })

//   it('fires when nested field is created', () => {
//     a.aField.set({
//       anotherField: true
//     })
//     expect(count).equals(1)
//   })

//   it('added data listener and removed other listeners', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(1)
//     expect(listeners).contains('data')
//   })

//   it('fires when nested field is updated', () => {
//     a.aField.anotherField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when parent field is removed', () => {
//     a.aField.remove()
//     expect(count).equals(1)
//   })

//   it('removed data listener, added property and reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(2)
//     expect(listeners).contains('property')
//     expect(listeners).contains('reference')
//   })

//   it('does not fire when parent field is added again', () => {
//     a.set({
//       aField: 3
//     })
//     expect(count).equals(0)
//   })

//   it('added another reference listener', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(3)
//     expect(listeners.numberOf('reference')).equals(2)
//     expect(listeners).contains('property')
//   })

//   it('fires when nested field is added again', () => {
//     a.aField.set({
//       anotherField: 1
//     })
//     expect(count).equals(1)
//   })

//   it('added data listener and removed other listeners', () => {
//     var listeners = testListeners(subscription)
//     expect(listeners.length).equals(1)
//     expect(listeners).contains('data')
//   })
// })
