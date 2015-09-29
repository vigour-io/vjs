describe('references', function () {
  var Observable = require('../../../../../lib/observable')
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
    measure.a.val = { total: 0, origin: {} }

    a = new Observable({
      key: 'a',
      on: {
        data: function (data, event) {
          var originkeyCnt = measure.a.val.origin[event.origin.key]
          measure.a.val.origin[event.origin.key] = originkeyCnt ? (originkeyCnt + 1) : 1
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
    aRef.val = 'a change'
    expect(measure.a.val.a).msg('a context').to.equal(2)
    expect(measure.a.val.b).msg('b context').to.equal(2)
    expect(measure.a.val.total).to.equal(4)
    expect(measure.a.val.origin.a).msg('a origin').to.equal(1)
    expect(measure.a.val.origin.b).msg('b origin').to.equal(1)
    expect(measure.a.val.origin.aRef).msg('aRef origin').to.equal(2)
  })

  it('add change listener "second" on b', function () {
    measure.b.second = { total: 0, origin: {} }
    b.val = {
      on: {
        data: {
          second: function (data, event) {
            var originkeyCnt = measure.b.second.origin[event.origin.key]
            measure.b.second.origin[event.origin.key] = originkeyCnt ? (originkeyCnt + 1) : 1
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
    expect(measure.a.val.origin.aRef).msg('aRef origin').to.equal(2)
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
    expect(measure.a.val.origin.aRef).msg('aRef origin (a val)').to.equal(4)
    expect(measure.b.second.origin.aRef).msg('aRef origin )(b context)').to.equal(1)
  })

  it('create new aRef --> bRef', function () {
    bRef = new aRef.Constructor({
      key: 'bRef'
    })
    aRef.val = 'wow more change'
    expect(measure.a.val.a).msg('a context (a val)').to.equal(5)
    expect(measure.a.val.b).msg('b context (a val)').to.equal(6)
    expect(measure.a.val.total).to.equal(11)
    expect(measure.b.second.b).msg('b context (b second)').to.equal(3)
    expect(measure.b.second.total).to.equal(3)
  })

  it('change bRef', function () {
    bRef.val = 'im changeing bRef'
    expect(measure.a.val.a).msg('a context (a val)').to.equal(5)
    expect(measure.a.val.b).msg('b context (a val)').to.equal(6)
    expect(measure.a.val.total).to.equal(11)
    expect(measure.b.second.b).msg('b context (b second)').to.equal(3)
    expect(measure.b.second.total).to.equal(3)
  })
})
