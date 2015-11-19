var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var data = new Observable(require('./data.json'))

describe('real data stress test 1', function () {
  var dataHolder = new Observable({
    content: data
  })

  it('subscribing on shows', function (done) {
    dataHolder.subscribe({
      content: {
        shows: true
      }
    }, function (data) {
      expect(data.origin.key).equals('shows')
      done()
    }).run()
  })

  it('subscribing on multiple extra things', function () {
    var arr = []
    var contentsub = {
      discover_row1_free: true,
      discover_row2_free: true
    }
    dataHolder.subscribe({
      content: contentsub
    }, function (data) {
      arr.push(data.origin.key)
    }).run()

    for (var i in contentsub) {
      expect(arr).contains(i)
    }
  })

  it('subscribing on exact same pattern', function () {
    var arr = []
    var contentsub = {
      discover_row1_free: true,
      discover_row2_free: true
    }

    console.log('-same pattern party-')
    dataHolder.subscribe({
      content: contentsub
    }, function (data) {
      arr.push(data.origin.key)
    }).run()

    for (var i in contentsub) {
      expect(arr).contains(i)
    }
  })
})
