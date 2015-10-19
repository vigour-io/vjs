/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var info = require('../../../../../lib/observable/subscribe/emitter/info')
var getId = info.getId
var getLateral = info.getLateral
var subscribtion
var count

function testListeners(subscribtion) {
  var hash = subscribtion.key
  var listeners = []
  var ids = []
  subscribtion.listensOnAttach.each((property) => {
    if (property.key === 'data') {
      property.attach.each((prop) => {
        listeners.push(property.key)
        let info = prop[3]
        let id = getId(info)
        expect(typeof info).equals('number')
        expect(id).ok
        expect(ids).not.contains(id)
        ids.push(id)
        console.info(hash, '-', property.key, ':', info, '- id:', getId(info), '- lateral:', getLateral(info),ids)
      })
    }
    if (property.key === 'property') {
      property.attach.each((prop) => {
        listeners.push(property.key)
        let info = prop[3]
        console.info(hash, '-', property.key, ':', info, '- id:', getId(info), '- lateral:', getLateral(info))
      })
    }
    if (property.key === 'parent') {
      property.attach.each((prop) => {
        listeners.push(property.key)
        let info = prop[3]
        expect(typeof info).equals('number')
        console.info(hash, '-', property.key, ':', info, '- id:', getId(info), '- lateral:', getLateral(info))
      })
    }
    if (property.key === 'reference') {
      property.attach.each((prop) => {
        listeners.push(property.key)
        let info = prop[3]
        expect(typeof info).equals('number')
        console.info(hash, '-', property.key, ':', info, '- id:', getId(info), '- lateral:', getLateral(info))
      })
    }
  })
  console.info('---listeners:', listeners)
  return listeners
}

beforeEach(function () {
  count = 0
})

describe('subscribing to single existing field', function () {
  var a = new Observable({
    aField: 1
  })

  it('subcribes to field', function () {
    subscribtion = a.subscribe({
      aField: true
    }, function (event, meta) {
      count++
    })
  })

  it('added a data listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it("doesn't fire on subscribing", function () {
    expect(count).equals(0)
  })

  it('fires when field is updated', function () {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is removed', function () {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed data listener and added property and reference listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when field is added again', function () {
    a.set({
      aField: 3
    })
    expect(count).equals(1)
  })

  it('added data listener and removed property and reference listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })
})

describe('subscribing on non-existent field', function () {
  var a = new Observable()

  it('subcribes to field', function () {
    subscribtion = a.subscribe({
      aField: true
    }, function () {
      count++
    })
  })

  it('added a reference and property listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it("doesn't fire on subscribing", function () {
    expect(count).equals(0)
  })

  it('fires when field is created', function () {
    a.set({
      aField: true
    })
    expect(count).equals(1)
  })

  it('added data listener and removed property and reference listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })

  it('fires when field is updated', function () {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when field is removed', function () {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed data listener and added property and reference listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(2)
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it('fires when field is added again', function () {
    a.set({
      aField: 3
    })
    expect(count).equals(1)
  })

  it('added data listener and removed property and reference listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(1)
    expect(listeners).contains('data')
  })
})

describe('subscribing on one non-existent field, one existing field', function () {
  var a = new Observable({
    aField: 1
  })

  it('subcribes to two fields', function () {
    subscribtion = a.subscribe({
      aField: true,
      anotherField: true
    }, function () {
      count++
    })
  })

  it('added data, property and reference listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(3)
    expect(listeners).contains('data')
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  it("doesn't fire on subscribing", function () {
    expect(count).equals(0)
  })

  it('fires when one field is updated', function () {
    a.aField.val = 2
    expect(count).equals(1)
  })

  it('fires when other field is created', function () {
    a.set({
      anotherField: true
    })
    expect(count).equals(1)
  })

  it('removed property and reference listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(2)
    expect(listeners).deep.equals(['data', 'data'])
  })

  it('fires when other field is updated', function () {
    a.anotherField.val = 2
    expect(count).equals(1)
  })

  it('fires once when aField is removed', function () {
    a.aField.remove()
    expect(count).equals(1)
  })

  it('removed one data listener, added property and reference listener', () => {
    var listeners = testListeners(subscribtion)
    expect(listeners.length).equals(3)
    expect(listeners).contains('data')
    expect(listeners).contains('reference')
    expect(listeners).contains('property')
  })

  // it('fires once when anotherField is removed', function () {
  //   a.anotherField.remove()
  //   expect(count).equals(1)
  // })  

  // it('removed data listeners, added property and reference listener', () => {
  //   var listeners = testListeners(subscribtion)
  //   expect(listeners.length).equals(2)
  //   expect(listeners).contains('reference')
  //   expect(listeners).contains('property')
  // })

  // it('fires when field is added again', function () {
  //   a.set({
  //     aField: 3
  //   })
  //   expect(count).equals(1)
  // })
})

// describe('subscribing on two non-existent fields', function () {
//   var a = new Observable()

//   it('subcribes to two fields', function () {
//     a.subscribe({
//       aField: true,
//       anotherField: true
//     }, function () {
//       count++
//     })
//   })

//   it("doesn't fire on subscribing", function () {
//     expect(count).equals(0)
//   })

//   it('fires when one field is created', function () {
//     a.set({
//       aField: true
//     })
//     expect(count).equals(1)
//   })

//   it('fires when other field is created', function () {
//     a.set({
//       anotherField: true
//     })
//     expect(count).equals(1)
//   })

//   it('fires when one field is updated', function () {
//     a.aField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when other field is updated', function () {
//     a.anotherField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when one field is removed', function () {
//     a.aField.remove()
//     expect(count).equals(1)
//   })

//   it('fires when field is added again', function () {
//     a.set({
//       aField: 3
//     })
//     expect(count).equals(1)
//   })

//   it('fires when other field is updated', function () {
//     a.anotherField.val = 3
//     expect(count).equals(1)
//   })
// })

// describe('subscribing on existent nested field', function () {
//   var a = new Observable({
//     aField: {
//       anotherField: 1
//     }
//   })

//   it('subcribes to nested field', function () {
//     a.subscribe({
//       aField: {
//         anotherField: true
//       }
//     }, function () {
//       count++
//     })
//   })

//   it("doesn't fire on subscribing", function () {
//     expect(count).equals(0)
//   })

//   it('fires when nested field is updated', function () {
//     a.aField.anotherField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when parent field is removed', function () {
//     a.aField.remove()
//     expect(count).equals(1)
//   })

//   it('does not fire when parent field is added again', function () {
//     a.set({
//       aField: 3
//     })
//     expect(count).equals(0)
//   })

//   it('fires when nested field is added again', function () {
//     a.aField.set({
//       anotherField: 1
//     })
//     expect(count).equals(1)
//   })
// })

// describe('subscribing on non-existent nested field in existing field', function () {
//   var a = new Observable({
//     aField: true
//   })

//   it('subcribes to nested field', function () {
//     a.subscribe({
//       aField: {
//         anotherField: true
//       }
//     }, function () {
//       count++
//     })
//   })

//   it("doesn't fire on subscribing", function () {
//     expect(count).equals(0)
//   })

//   it('fires when nested field is created', function () {
//     a.aField.set({
//       anotherField: true
//     })
//     expect(count).equals(1)
//   })

//   it('fires when nested field is updated', function () {
//     a.aField.anotherField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when parent field is removed', function () {
//     a.aField.remove()
//     expect(count).equals(1)
//   })

//   it('does not fire when parent field is added again', function () {
//     a.set({
//       aField: 3
//     })
//     expect(count).equals(0)
//   })

//   it('fires when nested field is added again', function () {
//     a.aField.set({
//       anotherField: 1
//     })
//     expect(count).equals(1)
//   })
// })

// describe('subscribe on non-existent nested field in non-existent field', function () {
//   var a = new Observable()

//   it('subcribes to nested field', function () {
//     a.subscribe({
//       aField: {
//         anotherField: true
//       }
//     }, function () {
//       count++
//     })
//   })

//   it("doesn't fire on subscribing", function () {
//     expect(count).equals(0)
//   })

//   it("doesn't fire on setting top level field", function () {
//     a.set({
//       aField: true
//     })
//     expect(count).equals(0)
//   })

//   it('fires when nested field is created', function () {
//     a.aField.set({
//       anotherField: true
//     })
//     expect(count).equals(1)
//   })

//   it('fires when nested field is updated', function () {
//     a.aField.anotherField.val = 2
//     expect(count).equals(1)
//   })

//   it('fires when parent field is removed', function () {
//     a.aField.remove()
//     expect(count).equals(1)
//   })

//   it('does not fire when parent field is added again', function () {
//     a.set({
//       aField: 3
//     })
//     expect(count).equals(0)
//   })

//   it('fires when nested field is added again', function () {
//     a.aField.set({
//       anotherField: 1
//     })
//     expect(count).equals(1)
//   })
// })
