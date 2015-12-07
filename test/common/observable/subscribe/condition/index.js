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
      nest: {
        title: 'foo'
      },
      trouble: false
    },
    nested2: {
      subtitle: 'bar'
    },
    nested3: {
      subtitle: 'funk'
    }
  })

  it('fired once', function () {
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
    }).run()

    expect(countOne).equals(1)
  })

  it('updating condition title doesnt fire subscription', function () {
    obs.nested1.nest.title.val = 'foo'
    expect(countOne).equals(0)
  })

  it('updating nested1 fires subscription', function () {
    obs.nested1.val = 'foo'
    expect(countOne).equals(1)
  })

  it('invalidating condition removes listener on nested1', function () {
    obs.nested1.trouble.val = true
    obs.nested1.val = 'bar'
    expect(countOne).equals(0)
  })
})

describe('simple condition using any', function () {
  var obs = new Observable({
    nested1: {
      nest: {
        title: 'foo'
      },
      trouble: false
    },
    nested2: {
      subtitle: 'bar'
    },
    nested3: {
      subtitle: 'funk'
    }
  })

  it('fired twice', function () {
    obs.subscribe({
      $any: {
        $condition: {
          subtitle: true
        }
      }
    }, function (data) {
      countOne++
    }).run()

    expect(countOne).equals(2)
  })
})

describe('multiple conditions using any', function () {
  var obs = new Observable({
    nested1: {
      nest: {
        title: 'foo'
      },
      trouble: false
    },
    nested2: {
      subtitle: 'bar'
    },
    nested3: {
      subtitle: 'funk'
    }
  })

  it('fired trice', function () {
    obs.subscribe({
      $any: {
        $condition: [{
          subtitle: true
        }, {
          nest: {
            title: true
          }
        }]
      }
    }, function (data) {
      countOne++
    }).run()

    expect(countOne).equals(3)
  })
})
