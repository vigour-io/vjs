'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(function () {
  countOne = 0
  countTwo = 0
})

describe('support .val', function () {
  var obs = new Observable({
    field: {
      nested: 3,
      another: 1
    }
  })

  var callback = function (data) {
    console.error('=--->', data, data && data[0].origin.path)
    countOne++
  }

  var sub = obs.subscribe({
    field: {
      val: true,
      nested: true
    }
  }, callback)

  it('should fire for both obs.field and obs.field.nested', function () {
    obs.field.val = 3
    obs.field.nested.val = 2
    expect(countOne).equals(2)
  })

  it('adding field to the pattern', function () {
    var sub2 = obs.subscribe({
      field: {
        another: true
      }
    }, callback)

    obs.field.another.val = 3

    expect(countOne).equals(1)
  })

  // it('removing field from the pattern', function () {
  //   console.log('remove stuff from the pattern')
  //   expect(countOne).equals(1)
  // })
})
