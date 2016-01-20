'use strict'
var Observable = require('../../../../../lib/observable')
describe('references', function () {
  var measure = {
    a: {},
    b: {},
    c: {},
    aRef: {},
    bRef: {}
  }
  var aRef, bRef, a, b

  it('create new observable --> aRef', function () {
    aRef = new Observable({
      key: 'aRef',
      val: 1
    })
  })

  it('create new observable --> a, add change listener "val", set val to aRef', function () {
    console.log('yo bitch what up!')
    measure.a.val = {
      total: 0,
      origin: {}
    }

    a = new Observable({
      key: 'a',
      on: {
        data: function (data, event) {
          // ORIGIN ON EVENT IS REMOVED BETTER (WAS NOT USED ANYWHERE)
          // var originkeyCnt = measure.a.val.origin[event.origin.key]
          // measure.a.val.origin[event.origin.key] = originkeyCnt ? (originkeyCnt + 1) : 1
          console.log('yo yo yo! FIRE THAT BITCH', this.path)
          var keyCnt = measure.a.val[this.key]
          measure.a.val.total += 1
          measure.a.val[this.key] = keyCnt ? (keyCnt + 1) : 1
        }
      }
    })
    expect(measure.a.val.total).to.equal(0)
    a.val = aRef
    expect(measure.a.val.a).to.equal(1)
    expect(measure.a.val.total).to.equal(1)
  })

  it('create new a --> b', function () {
    b = new a.Constructor({
      key: 'b'
    })
    expect(measure.a.val.b).to.equal(1)
    expect(measure.a.val.total).to.equal(2)
  })

  it('change aRef', function () {
    console.clear()
    aRef.val = 'a change'
    expect(measure.a.val.a).msg('a context').to.equal(2)
    console.log('yo!')
    expect(measure.a.val.b).msg('b context').to.equal(2)
    expect(measure.a.val.total).to.equal(4)
    // expect(measure.a.val.origin.a).msg('a origin').to.equal(1)
    // expect(measure.a.val.origin.b).msg('b origin').to.equal(1)
    // expect(measure.a.val.origin.aRef).msg('aRef origin').to.equal(2)
  })

  it('add change listener "second" on b', function () {
    measure.b.second = {
      total: 0,
      origin: {}
    }
    b.val = {
      on: {
        data: {
          second: function (data, event) {
            // var originkeyCnt = measure.b.second.origin[event.origin.key]
            // measure.b.second.origin[event.origin.key] = originkeyCnt ? (originkeyCnt + 1) : 1
            var keyCnt = measure.b.second[this.key]
            measure.b.second.total += 1
            measure.b.second[this.key] = keyCnt ? (keyCnt + 1) : 1
          }
        }
      }
    }
    expect(measure.a.val.a).msg('a context').to.equal(2)
    expect(measure.a.val.b).msg('b context').to.equal(3)
    expect(measure.a.val.total).to.equal(5)
    expect(measure.b.second.total).to.equal(0)
    // expect(measure.a.val.origin.aRef).msg('aRef origin').to.equal(2)
  })

  it('add property "prop1" on a', function () {
    a.val = {
      prop1: true
    }
    expect(measure.a.val.a).msg('a context').to.equal(3)
    expect(measure.a.val.b).msg('b context').to.equal(4)
    expect(measure.a.val.total).to.equal(7)
    expect(measure.b.second.b).msg('b context').to.equal(1)
    expect(measure.b.second.total).to.equal(1)
  })

  it('change aRef', function () {
    aRef.val = 'another change'
    expect(measure.a.val.a).msg('a context (a val)').to.equal(4)
    expect(measure.a.val.b).msg('b context (a val)').to.equal(5)
    expect(measure.a.val.total).to.equal(9)
    expect(measure.b.second.b).msg('b context (b second)').to.equal(2)
    expect(measure.b.second.total).to.equal(2)
    // expect(measure.a.val.origin.aRef).msg('aRef origin (a val)').to.equal(4)
    // expect(measure.b.second.origin.aRef).msg('aRef origin )(b context)').to.equal(1)
  })

  it('create new aRef --> bRef', function () {
    console.clear()
    bRef = new aRef.Constructor({
      // exlcude it when in instance!
      key: 'bRef'
    })
    expect(measure.a.val.a).msg('a context (a val)').to.equal(4)
    // fires for bref of course dirty balls
    aRef.val = 'wow more change'
    // should be 5? how 7??? one to many
    // so whats happenin here?
    expect(measure.a.val.a).msg('a context (a val)').to.equal(5)
    // this is wrong should not fire on new listener thats lame
    // expect(measure.a.val.b).msg('b context (a val)').to.equal(6)
    // expect(measure.a.val.total).to.equal(11)
    // expect(measure.b.second.b).msg('b context (b second)').to.equal(3)
    // expect(measure.b.second.total).to.equal(3)
  })

  it('change bRef', function () {
    bRef.val = 'im changeing bRef'
    expect(measure.a.val.a).msg('a context (a val)').to.equal(5)
    expect(measure.a.val.b).msg('b context (a val)').to.equal(6)
    expect(measure.a.val.total).to.equal(11)
    expect(measure.b.second.b).msg('b context (b second)').to.equal(3)
    expect(measure.b.second.total).to.equal(3)
  })

  require('./property')
  require('./unique')
  require('./reference')
})

describe('on reference, switching reference multiple times', function () {
  var count = 0

  var a = new Observable({
    key: 'a'
  })
  var b = new Observable({
    key: 'b'
  })
  var c = new Observable({
    key: 'c'
  })
  var d = new Observable({
    key: 'd'
  })

  var obs = new Observable({
    on: {
      reference () {
        count++
      }
    }
  })

  beforeEach(function () {
    count = 0
  })

  it('add reference, fires listener', function () {
    obs.val = a
    expect(count).equals(1)
  })

  it('change reference, fires listener', function () {
    obs.val = b
    expect(count).equals(1)
  })

  it('change reference, fires listener', function () {
    obs.val = c
    expect(count).equals(1)
  })

  it('change reference, fires listener', function () {
    obs.val = d
    expect(count).equals(1)
  })
})

describe('on reference, nested multiple instances with different reference each', function () {
  var count = 0

  var content = new Observable({
    nested: {
      a: {},
      b: {},
      c: {},
      d: {}
    }
  })

  var Obs = new Observable({
    on: {
      reference () {
        count++
      }
    }
  }).Constructor

  beforeEach(function () {
    count = 0
  })

  it('a instance, fires listener', function () {
    new Obs(content.nested.a) //eslint-disable-line
    expect(count).equals(1)
  })

  it('b instance, fires listener', function () {
    new Obs(content.nested.b) //eslint-disable-line
    expect(count).equals(1)
  })

  it('c instance, fires listener', function () {
    new Obs(content.nested.c) //eslint-disable-line
    expect(count).equals(1)
  })

  it('d instance, fires listener', function () {
    new Obs(content.nested.d) //eslint-disable-line
    expect(count).equals(1)
  })
})
