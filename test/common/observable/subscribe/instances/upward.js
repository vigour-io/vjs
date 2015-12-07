'use strict'
/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')

describe('subscribing to same parent with multiple instances', function () {
  var Uplooker = new Observable().Constructor
  var count = 0
  var ding1, ding2, ding3

  Uplooker.prototype.subscribe({
    $upward: {
      targetkey: true
    }
  }, function () {
    count++
  })
  it('create Observable with 2 Uplookers', function () {
    ding1 = new Observable({
      key: 'ding1',
      properties: {
        looker: Uplooker,
        lalwex: Uplooker
      },
      lolwat: false,
      looker: true
    })
    expect(count).equals(0)
  })

  it('create first instance', function () {
    ding2 = new ding1.Constructor({
      targetkey: 'doing it',
      lalwex: 'hurp'
    })
    expect(count).equals(2)
  })

  it('create another instance', function () {
    ding3 = new ding2.Constructor({
      targetkey: 'hatsepats'
    })
    expect(count).equals(4)
  })
})