describe('off', function () {
  var Observable = require('../../../../../lib/observable')
  var util = require('../../../../../lib/util')

  var aRef
  var a
  var b
  var c
  var ref

  function specialListener () {}
  function weirdListener () {}

  it('create new observable --> a, overwrite different types of keys', function () {
    aRef = new Observable({
      key: 'aRef',
      val: 'a value for aRef'
    })

    a = new Observable({
      key: 'a',
      on: {
        data: {
          other: function () {},
          special: function () {}
        }
      },
      val: 1
    })

    a.set({
      on: {
        data: {
          special: [ function () {}, aRef ]
        }
      }
    })
    // same for attach and base
    expect(a._on.data.fn.other).msg('fn.other').to.be.ok
    expect(a._on.data.fn.special).msg('fn.special').to.be.null
    // remove fn if its completely empty
    a._on.data.fn.removeProperty(a._on.data.fn.other, 'other')
    expect(a._on.data.fn).msg('fn').to.be.null
  })

  it('new observable --> a --> b --> c, overwrite listeners, remove listeners', function () {
    ref = new Observable({
      key: 'ref'
    })
    a = new Observable({
      key: 'a',
      on: {
        data: {
          other: function () {},
          special: specialListener,
          attacher: [ specialListener ],
          weird: weirdListener
        }
      },
      val: ref
    })
    b = new a.Constructor({
      key: 'b',
      on: {
        data: {
          other: function () {}
        }
      }
    })

    expect(b._on.data.fn.special).to.equal(a._on.data.fn.special)
    expect(b._on.data.fn.other).to.not.equal(a._on.data.fn.other)
    expect(b._on).to.be.an.instanceof(a._on.Constructor)
    expect(b._on.data.fn).to.be.an.instanceof(a._on.data.fn.Constructor)
    a.off('data', 'other')
    expect(b._on.data.fn.other).to.be.ok
    expect(a._on.data.fn.other).to.be.null
    c = new b.Constructor({
      key: 'c'
    })

    c.off('data', 'special')

    expect(b._on.data.fn.special)
      .msg('b._on.data.fn.special').to.be.ok
    expect(c._on.data.fn.special)
      .msg('c._on.data.fn.special').to.be.null
    expect(c._on).to.be.an.instanceof(b._on.Constructor)
  })

  it('findAndRemove removals of listeners', function () {
    // removes both attach and fn (all ocurrences)
    b.off('data', specialListener)
    expect(a._on.data.fn.special).to.be.ok
    expect(b._on.data.fn.special).to.be.null
    expect(a._on.data.attach).to.be.ok
    expect(b._on.data.attach).to.be.null

    ref.set({
      on: {
        data: [ function () {}, a ]
      }
    })

    expect(ref._on.data.base).to.be.ok
    expect(ref._on.data.attach).to.be.ok
    expect(util.isEmpty(a.listensOnBase)).to.be.false
    expect(util.isEmpty(a.listensOnAttach)).to.be.false

    ref.off('data', a)
    expect(ref._on.data.base).to.be.null
    expect(ref._on.data.attach).to.be.null
    expect(util.isEmpty(a.listensOnBase)).to.be.true
    expect(util.isEmpty(a.listensOnAttach)).to.be.true

    a.off(weirdListener)
    expect(a._on.data.fn.weird).to.be.null
  })

  it('create new obserable a, findAndRemove removals of listeners with options objects', function () {
    function normal () {}

    var aRandomObs = new Observable({
      key: 'aRandomObs'
    })

    var a = new Observable({
      key: 'a',
      on: {
        data: {
          fner: normal,
          attacher: [ normal ],
          baser: aRandomObs,
          attach2: [ function () {}, aRandomObs ]
        },
        randomEmitter: {
          fner: normal,
          baser: aRandomObs,
          attacher: [ normal ]
        }
      }
    })

    a.off({
      fn: normal,
      base: aRandomObs
    })

    expect(a._on.randomEmitter.fn).to.be.null
    expect(a._on.randomEmitter.base).to.be.null
    expect(a._on.data.fn).to.be.null
    expect(a._on.data.base).to.be.null

    a.off('data', {
      attach: aRandomObs
    })

    expect(a._on.data.attach.attach2).to.be.null
    expect(a._on.data.attach.attacher).to.be.ok
    expect(a._on.randomEmitter.attach.attacher).to.be.ok
  })
})
