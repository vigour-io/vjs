'use strict'
describe('combined', function () {
  var Observable = require('../../../../../lib/observable')
  var isRemoved = require('../../../../../lib/util/is/removed')
  var On = require('../../../../../lib/observable/on/constructor')
  var Emitter = require('../../../../../lib/emitter')
  var measure = {
    a: {}
  }
  var a //eslint-disable-line
  var b //eslint-disable-line
  var aRef

  it('create new observable --> a --> use references change a', function () {
    measure.a = {
      reference: {
        val: { total: 0 }
      },
      data: {
        val: { total: 0 }
      },
      property: {
        val: { total: 0 }
      }
    }

    aRef = new Observable({
      key: 'aRef',
      val: 'a value for aRef'
    })

    a = new Observable({
      key: 'a',
      on: {
        data: function () {
          measure.a.data.val.total++
        },
        reference: function () {
          measure.a.reference.val.total++
        },
        property: function () {
          measure.a.property.val.total++
        }
      },
      val: aRef
    })

    expect(aRef._on.data.base[a.uid]).to.equal(a)

    a.val = 10
    expect(aRef._on.data.base).to.be.null

    expect(measure.a.reference.val.total).to.equal(1)
    expect(measure.a.data.val.total).to.equal(1)

    a.val = 20
    expect(measure.a.reference.val.total).to.equal(1)
    expect(measure.a.data.val.total).to.equal(2)
    expect(measure.a.property.val.total).to.equal(0)

    a.set({
      val: aRef,
      prop1: true
    })

    expect(measure.a.reference.val.total).to.equal(2)
    expect(measure.a.data.val.total).to.equal(3)
    expect(measure.a.property.val.total).to.equal(1)
    expect(aRef._on.data.base[a.uid]).to.equal(a)
  })

  it('create new observable --> aO --> a --> b references - remove aRef', function () {
    // are we absolutely sure about this??
    // it is not really a property (maybe just add an extra value listener if you want to know this)
    var SpecialEmitter = new Emitter().Constructor

    var aO = new Observable({ //eslint-disable-line
      flags: {
        on: new On({
          define: {
            ChildConstructor: SpecialEmitter
          }
        })
      }
    })

    a = new Observable({
      key: 'a',
      aNest: {}
    })

    aRef = new Observable({
      key: 'aRef',
      on: {
        data: {
          val: function (data, event) {
            this.remove(event)
          }
        }
      },
      val: a.aNest
    })

    // this is the only spot we really need last stamp for
    // b listens on a.aNest , and updates aNest --
    // only way to do this is by adding laststamp on the actual listener (the fns instead of the rest)
    var b = new Observable({ //eslint-disable-line
      key: 'b',
      on: {
        data: {
          b: [ function () {}, a.aNest ],
          a: a.aNest
        }
      },
      val: a.aNest
    })

    expect(a.aNest._on.data.base[aRef.uid]).to.be.ok
    a.aNest.val = 'x'
    expect(isRemoved(aRef)).to.be.true
    expect(a.aNest._on.data.base[aRef.uid]).to.be.not.ok
  })

  it('test new emitter', function () {
    measure.a.new = {
      val: {
        total: 0,
        b: 0,
        c: 0,
        x: 0,
        y: 0
      }
    }

    a = new Observable({
      key: 'a',
      on: {
        new: function (data, event) {
          measure.a.new.val.total++
          measure.a.new.val[this.key]++
        }
      },
      useVal: true
    })

    var b = new a.Constructor({ key: 'b' })
    var c = new b.Constructor({ key: 'c' }) //eslint-disable-line
    var holder = new Observable({ key: 'holder' })

    holder.set({
      x: new a.Constructor({ key: 'x' }),
      y: new a.Constructor({ key: 'y' })
    })

    expect(measure.a.new.val.total).to.equal(4)
    expect(measure.a.new.val.b).to.equal(1)
    expect(measure.a.new.val.c).to.equal(1)
    expect(measure.a.new.val.x).to.equal(1)
    expect(measure.a.new.val.y).to.equal(1)
  })

  it('test custom emitter base type listener', function () {
    var total = 0
    var total2 = 0
    var listener = new Observable({
      key: 'listener',
      on: {
        someKindOfEvent: function () {
          total2++
        }
      }
    })
    var obs = new Observable({
      key: 'obs',
      on: {
        someKindOfEvent: {
          a: function () {
            total++
          },
          b: listener
        }
      }
    })
    obs.emit('someKindOfEvent')
    expect(total).to.equal(1)
    expect(total2).to.equal(1)
  })

  it('using numbers as keys, id counter for addListener global', function () {
    var total = 0
    var obs = new Observable({
      key: 'obs',
      on: {
        data: {
          0: function () {
            total++
          },
          1: function () {
            total++
          }
        }
      }
    })

    obs.on(function () {
      // now dont overwrite 1!
    })

    obs.val = 2
    expect(total).to.equal(2)
  })

  it('should remove listensOnBase[1]', function () {
    // TODO: may clean up listensOnBase when its empty
    var b = new Observable({
      key: 'b'
    })

    var a = new Observable({
      key: 'a',
      on: {
        data: b
      }
    })

    expect(b.listensOnBase).to.be.ok

    var c = new Observable({
      key: 'c'
    })

    a.set({
      on: {
        data: c
      }
    })

    expect(b.listensOnBase[1]).to.be.not.ok
    expect(c.listensOnBase[1]).to.be.ok
  })
})
