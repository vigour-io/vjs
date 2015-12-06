'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(function () {
  countOne = 0
  countTwo = 0
})

describe('simple condition', function () {
  var obs = new Observable({
    val: new Observable({
      val: new Observable({
        nested1: {
          nest: {
            title: 'foo'
          },
          trouble: false
        }
      }),
      nested2: {
        subtitle: 'bar'
      },
      nested3: {
        subtitle: 'funk'
      }
    })
  })

  obs.subscribe({
    nested1: {
      $condition: {
        nest: {
          title: true
        },
        trouble (trouble) {
          return trouble.val === false
        }
      }
    }
  }, function (data) {
    countOne++
    console.log('--fire-->', data.origin.path)
  })

  it('fired once', function () {
    expect(countOne).equals(1)
  })
})
