'use strict'
/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count

beforeEach(function () {
  count = 0
})

describe('subscribing to any field', function () {
  var obs = new Observable({
    one: {},
    two: {},
    three: {}
  })

  it('should fire once for all fields', function () {
    obs.subscribe({
      $any: true
    }, function (data) {
      count++
    }).run()

    expect(count).equals(3)
  })

  it('adding a field fires subscription', function(){
    obs.set({
      randomField: {
        nested: true
      }
    })
    expect(count).equals(1)
  })
})

