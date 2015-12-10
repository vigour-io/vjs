'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(function () {
  countOne = 0
  countTwo = 0
})

describe('subscribe to parent key', function () {
  var obs = new Observable()
  var returnedValue
  var parent = new Observable({
    key: 'success'
  })

  it('subscribes to key', function () {
    obs.subscribe({
      parent: {
        key: true
      }
    }, function (data, event) {
      returnedValue = data[0].origin
    })
  })

  it('fires when added to parent with key', function () {
    parent.set({
      child: {
        useVal: obs
      }
    })

    expect(returnedValue).equals('success')
  })
})

// describe('subscribe to upward parent with specific key', function () {
//   var obs = new Observable()
//   var returnedValue
//   var parent = new Observable({
//     key: 'success'
//   })

//   it('subscribes to key', function () {
//     obs.subscribe({
//       parent: {
//         key: true
//       }
//     }, function (data, event) {
//       returnedValue = data[0].origin
//     })
//   })

//   it('fires when added to parent with key', function () {
//     parent.set({
//       child: {
//         useVal: obs
//       }
//     })

//     expect(returnedValue).equals('success')
//   })
// })