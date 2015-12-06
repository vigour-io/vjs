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
    nested1: {
      title: 'foo'
    },
    nested2: {
      subtitle: 'bar'
    },
    nested3: {
      subtitle: 'funk'
    }
  })

  // if title = 'foo'
  var condition = {
    title (obs) {
      return obs.val === 'foo'
    }
  }

  obs.subscribe({
    nested1: {
      $condition: [condition]
    },
    nested2: {
      $condition: [condition]
    },
    nested3: {
      $condition: [condition]
    }
  })

  it('added listeners to item containing correct title', function () {


    expect(testListeners(obs.nested1)).contains('data')
    expect(testListeners(obs.nested2)).not.contains('data')
    expect(testListeners(obs.nested3)).not.contains('data')
  })
})
