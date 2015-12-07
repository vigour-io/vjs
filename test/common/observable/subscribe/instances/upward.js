'use strict'
/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')

describe('subscribing to same parent with multiple instances', function () {
  var Uplooker = new Observable().Constructor
  var count = 0
  var paths = {}
  var ding1, ding2, ding3

  var NestedLooker
  var ding4, ding5, ding6

  Uplooker.prototype.subscribe({
    $upward: {
      targetkey: true
    }
  }, function () {
    console.log('pop dat subscription listener', this.path.join('-'))
    count++
    paths[this.path.join('-')] = true
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
      key: 'ding2',
      targetkey: 'doing it',
      lalwex: 'hurp'
    })
    expect(count).equals(2)
  })

  it('create another instance', function () {
    ding3 = new ding2.Constructor({
      key: 'ding3',
      targetkey: 'hatsepats'
    })
    expect(count).equals(4)
  })

  it('create Uplooker with nested Uplookers', function () {
    ding4 = new Uplooker({
      key: 'ding4',
      properties: {
        looker: Uplooker,
        lalwex: Uplooker,
        morelook: Uplooker
      },
      looker: true
    })

    ding5 = new ding4.Constructor({
      key: 'ding5',
      lalwex: true,
      targetkey: 'bem'
    })

    expect(paths).to.have.property('ding5')
    expect(paths).to.have.property('ding5-looker')
    expect(paths).to.have.property('ding5-lalwex')
    expect(count).equals(7)

    ding6 = new ding4.Constructor({
      key: 'ding6',
      morelook: 'yes',
      targetkey: 'hats'
    })

    expect(paths).to.have.property('ding6')
    expect(paths).to.have.property('ding6-looker')
    expect(paths).to.have.property('ding6-lalwex')
    expect(paths).to.have.property('ding6-morelook')
    expect(count).equals(11)
  })
})
