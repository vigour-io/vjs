/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../../lib/observable')
var count
var instance

beforeEach(() => {
  count = 0
})

describe('subscribing to different fields on same parent, multiple instances different references', function () {
  var content = new Observable({
    nested: {
      a: {
        title: 'aTitle'
      },
      b: {
        title: 'bTitle'
      },
      c: {
        title: 'cTitle'
      }
    }
  })

  var one = new Observable()

  it('subcribes to field', function () {
    one.subscribe({
      // parent: {
      title: true
        // }
    }, function (data) {
      console.log('myPath',this.path)
      console.log('originPath',data.origin.path)
      instance = this
      count++
    })
  })

  it('fires on instance', function () {
    new Observable({
      one: {
        useVal: new one.Constructor({
          key: 'one',
          val: content.nested.a
        })
      },
      two: {
        useVal: new one.Constructor({
          key: 'two',
          val: content.nested.b
        })
      },
      three: {
        useVal: new one.Constructor({
          key: 'three',
          val: content.nested.c
        })
      }
    })
    expect(count).equals(3)
      // expect(instance.key).equals('b')
  })
})

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
