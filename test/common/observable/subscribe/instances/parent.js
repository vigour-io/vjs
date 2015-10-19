/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count
var instance

beforeEach(() => {
  count = 0
})

// describe('subscribing to same parent with multiple instances', function () {
//   var keys = []
//   var a = new Observable({
//     key: 'a'
//   })
//   var b
//   it('subcribes to field', function () {
//     a.subscribe({
//       parent: {
//         field: true
//       }
//     }, function () {
//       keys.push(this.key)
//       count++
//     })

//     b = new a.Constructor({
//       key: 'b'
//     })
//     expect(count).equals(0)
//   })

//   it('fires on instance', function () {
//     new Observable({
//       field: 1,
//       a: {
//         useVal: a
//       },
//       b: {
//         useVal: b
//       }
//     })
//     expect(count).equals(2)
//     expect(keys).contains('a')
//     expect(keys).contains('b')
//   })
// })

// describe('subscribing to same parent with more instances', function () {
//   var keys = []

//   var a = new Observable({
//     trackInstances: true,
//     key: 'a'
//   })

//   it('subcribes to field', function () {
//     a.subscribe({
//       parent: {
//         field: true
//       }
//     }, function () {
//       keys.push(this.key)
//       count++
//     })
//   })

//   var b = new a.Constructor({
//     key: 'b'
//   })

//   var c = new b.Constructor({
//     key: 'c'
//   })

//   var d = new c.Constructor({
//     key: 'd'
//   })

//   it('fires on instance', function () {
//     new Observable({
//       field: 1,
//       a: {
//         useVal: a
//       },
//       b: {
//         useVal: b
//       },
//       c: {
//         useVal: c
//       },
//       d: {
//         useVal: d
//       }
//     })
//     expect(count).equals(4)
//     expect(keys).contains('a')
//     expect(keys).contains('b')
//     expect(keys).contains('c')
//     expect(keys).contains('d')
//   })
// })

describe('subscribing to different parent with several instances', function () {
  var keys = []

  var a = new Observable({
    trackInstances: true,
    key: 'a'
  })

  a.on('parent', () => {
    console.error('ballz')
  })

  var b = new a.Constructor({
    key: 'b'
  })

  it('add a to parent one', () => {
    console.log('-- add a to parent one')
    new Observable({
      key: 'one',
      field: 1,
      a: {
        useVal: a
      }
    })
  })

  it('add b to parent two', () => {
    console.log('-- add b to parent two')
    new Observable({
      key: 'two',
      field: 2,
      a: {
        useVal: new a.Constructor()
      }
    })
  })

  // it('subcribes to field', function () {
  //   a.subscribe({
  //     parent: {
  //       field: true
  //     }
  //   }, function (data) {
  //     console.log('---->', data.origin.val)
  //     keys.push(this.key)
  //     count++
  //   })
  // })



  // var c = new a.Constructor({
  //   key: 'c'
  // })

  // var d = new a.Constructor({
  //   key: 'd'
  // })





  //   new Observable({
  //     key:'two',
  //     field: 2,
  //     a: {
  //       useVal: b
  //     }
  //   })
  //   new Observable({
  //     key:'three',
  //     field: 3,
  //     a: {
  //       useVal: c
  //     }
  //   })
  //   new Observable({
  //     key:'four',
  //     field: 4,
  //     a: {
  //       useVal: d
  //     }
  //   })
  //   expect(count).equals(4)
  //   expect(keys).contains('a')
  //   expect(keys).contains('b')
  //   expect(keys).contains('c')
  //   expect(keys).contains('d')
  // })
})
