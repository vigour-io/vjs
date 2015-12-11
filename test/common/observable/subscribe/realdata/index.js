'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var testSubs = testListeners.subs
var contentdata = new Observable(require('./data.json'))

describe('real data stress test 1', function () {
  var dataHolder = new Observable({
    content: contentdata
  })

  it('subscribing on shows', function (done) {
    dataHolder.subscribe({
      content: {
        shows: true
      }
    }, function (data) {
      expect(data[0].origin.key).equals('shows')
      expect(testListeners(contentdata.shows).length).equals(1)
      expect(testSubs(dataHolder).length).equals(1)
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
      arr.push(data[0].origin.key)
    }).run()

    for (var i in contentsub) {
      expect(arr).contains(i)
    }

    expect(testListeners(contentdata.shows).length).equals(1)
    expect(testListeners(contentdata.discover_row1_free).length).equals(1)
    expect(testListeners(contentdata.discover_row2_free).length).equals(1)
    expect(testSubs(dataHolder).length).equals(2)
  })

  it('subscribing on exact same pattern', function () {
    var arr = []
    var contentsub = {
      discover_row1_free: true,
      discover_row2_free: true
    }

    dataHolder.subscribe({
      content: contentsub
    }, function (data) {
      arr.push(data[0].origin.key)
    }).run()

    for (var i in contentsub) {
      expect(arr).contains(i)
    }
    expect(testListeners(contentdata.shows).length).equals(1)
    expect(testListeners(contentdata.discover_row1_free).length).equals(1)
    expect(testListeners(contentdata.discover_row2_free).length).equals(1)
    expect(testSubs(dataHolder).length).equals(2)
  })

  xit('unsubscribing using pattern', function () {
    var arr = []
    var contentsub = {
      discover_row1_free: true,
      discover_row2_free: true
    }

    dataHolder.unsubscribe({
      content: contentsub
    })

    expect(testListeners(contentdata.discover_row1_free).length).equals(0)
    expect(testListeners(contentdata.discover_row2_free).length).equals(0)
    expect(testSubs(dataHolder).length).equals(1)
  })

  xit('unsubscribing other sub using pattern', function () {
    var arr = []
    var contentsub = {
      shows: true
    }

    dataHolder.unsubscribe({
      content: contentsub
    })

    expect(testListeners(contentdata.shows).length).equals(0)
    expect(testSubs(dataHolder).length).equals(0)
  })
})
