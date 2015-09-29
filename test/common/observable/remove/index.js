describe('remove', function () {
  var Event = require('../../../../lib/event')
  Event.prototype.inject(require('../../../../lib/event/toString'))
  var Base = require('../../../../lib/base')
  Base.prototype.inject(require('../../../../lib/methods/toString'))
  var Observable = require('../../../../lib/observable')
  var util = require('../../../../lib/util')
  var setKeyInternal = Observable.prototype.setKeyInternal
  var isRemoved = util.isRemoved
  var measure = {
    a: {}
  }
  var a
  var b

  it('create new observable --> a and remove using method', function () {
    a = new Observable({
      key: 'a',
      val: 1
    })
    a.remove()
    expect(a._input).to.be.null
    expect(isRemoved(a)).to.be.ok
  })

  it('create new observable listen on property, remove property check val', function () {
    a = new Observable({
      key: 'a',
      val: 1,
      b: {
        val: 'hello',
        on: {
          data: function (data, event) {
            expect(data).to.equal(null)
            expect(this.val).to.equal(null)
          }
        }
      }
    })
    a.remove()
  })

  it('create new observable --> a and remove using a set with null', function () {
    a = new Observable({
      key: 'a',
      val: 1
    })
    a.val = null
    expect(a._input).to.be.null
    expect(isRemoved(a)).to.be.ok
  })

  it('create new observable --> a and remove field "prop1"', function () {
    var cntKeySets = 0
    a = new Observable({
      key: 'a',
      on: {}, // defines that we are interested in instances
      prop1: {
        define: {
          setKeyInternal: function () {
            cntKeySets++
            return setKeyInternal.apply(this, arguments)
          }
        }
      },
      prop2: true,
      prop3: true,
      prop4: true,
      prop5: {
        prop6: true
      },
      prop7: {
        prop8: {
          prop9: {
            prop10: true
          }
        }
      },
      prop11: {
        prop12: true
      },
      prop13: {
        prop14: {
          prop15: {
            on: {
              data: function () {}
            }
          }
        }
      }
    })

    a.prop1.set({
      firstProperty: true,
      val: null,
      notImportant: true,
      notImportant2: true
    })

    // using a set this should result in 1 key call (no more sets after remove)
    expect(cntKeySets).to.equal(1)
    expect(a.prop1).to.be.null
  })

  it('new a --> b, handle instances and nested fields ', function () {
    b = new a.Constructor({
      key: 'b',
      prop4: null
    })

    expect(a.prop4).msg('prop4 in a').to.be.ok
    expect(b.prop4).msg('prop4 in b').to.be.null

    b.prop2.remove()
    expect(a).to.have.property('prop2')
    expect(a.prop2).msg('a.prop2').to.be.ok
    expect(b.prop2).msg('b.prop2').to.be.null

    expect(isRemoved(b)).msg('check if b is not removed').to.be.false

    b.prop3.clearContext().remove()

    expect(a.prop3).msg('a.prop3').to.be.null
    expect(b.prop3).msg('b.prop3').to.be.null

    expect(isRemoved(b))
      .msg('check if b still exists after instances removal of "prop3"')
      .to.be.false

    a.set({ prop4: null })
    a.set({ prop4: true })

    expect(a.prop4).msg('prop4 in a (reset)').to.be.ok
    expect(b.prop4).msg('prop4 in b (reset)').to.be.null

    b.prop5.prop6.remove()
    expect(a.prop5.prop6).msg('a.prop5.prop6').to.be.ok
    expect(b.prop5.prop6).msg('b.prop5.prop6').to.be.null

    b.prop7.prop8.prop9.remove()
    expect(a.prop7.prop8.prop9.prop10)
      .msg('a.prop7.prop8.prop9.prop10').to.be.ok
    expect(b.prop7.prop8.prop9)
      .msg('a.prop7.prop8.prop9').to.be.null

    // this test has to go to '.set' test
    b.prop11.prop12.set({
      prop13: true
    })

    expect(b.prop11.prop12)
      .msg('b.prop11.prop12').to.have.property('prop13')

    expect(a.prop11.prop12)
      .msg('a.prop11.prop12').to.not.have.property('prop13')

    b.prop13.prop14.prop15.remove()
    expect(a.prop13.prop14.prop15).to.be.ok
    expect(b.prop13.prop14.prop15).to.be.nullg
  })

  it('add change listener to a and remove a', function () {
    measure.a.val = {
      total: 0,
      removed: 0
    }

    // since we defined before that we want on:{} (we are inteserted in instances)
    // it will handle instances accordingly
    // TODO:think about unifiying this system since it maye be super important for hub
    a.set({
      on: {
        data: {
          val: function (data, event) {
            var keyCnt = measure.a.val[this.key]
            // second time is null should be b else things become very unclear
            measure.a.val[this.key] = keyCnt ? (keyCnt + 1) : 1
            measure.a.val.total++
            if (data === null) {
              measure.a.val.removed++
            }
          }
        }
      }
    })

    var changeEmitter = a._on.data
    var fn = changeEmitter.fn

    expect(fn).to.have.property('val')

    a.val = null

    expect(isRemoved(changeEmitter))
      .msg('check if changeEmitter is removed').to.be.true
    expect(isRemoved(fn))
      .msg('check if fn is removed').to.be.true
    expect(measure.a.val.a).msg('a val change context:a').to.equal(1)
    expect(measure.a.val.b).msg('a val change context:b').to.equal(1)
    expect(measure.a.val.total).to.equal(2)
    expect(isRemoved(a)).msg('check if a is removed').to.be.true
    expect(isRemoved(b)).msg('check if b is removed').to.be.true
    expect(measure.a.val.removed).msg('correct removed (data) count').to.equal(2)
  })

  it('create new observable --> a --> b, add ref - change listener, remove listener, test listens and removal', function () {
    var reffed = new Observable({
      key: 'reffed'
    })

    var reffed2 = new Observable({
      key: 'reffed2'
    })

    a = new Observable({
      key: 'a',
      val: reffed
    })

    reffed2.on('data', a)

    b = new a.Constructor({
      key: 'b'
    })

    var cnt = 0
    a.listensOnBase.each(function () {
      cnt++
    })

    expect(cnt).msg('listensOn in a').to.equal(2)

    reffed.remove()

    cnt = 0
    a.listensOnBase.each(function (prop, key) {
      cnt++
    })

    expect(cnt).msg('listensOn in a (after remove)').to.equal(1)

    a.remove()

    expect(reffed2._on.data.base)
      .msg('base listeners on reffed 2 (listens on reffed)').to.be.null
  })

  it('create new observable --> a --> b, add attach - change listener, remove listener, test listens and removal', function () {
    var reffed = new Observable({
      key: 'reffed'
    })

    var reffed2 = new Observable({
      key: 'reffed2'
    })

    a = new Observable({
      key: 'a'
    })

    reffed.on('data', [ function () {}, a ])
    reffed2.on('data', [ function () {}, a ])

    b = new a.Constructor({ key: 'b' })

    var cnt = 0
    a.listensOnAttach.each(function () {
      cnt++
    })

    expect(cnt).msg('listensOn in a').to.equal(2)

    reffed.remove()

    cnt = 0
    a.listensOnAttach.each(function (property) {
      cnt++
    })

    expect(cnt)
      .msg('listensOn in a (after remove)').to.equal(1)

    cnt = 0
    reffed2._on.data.attach.each(function () {
      cnt++
    })
    expect(cnt)
      .msg('base listeners on reffed 2 (listens on reffed)').to.equal(1)

    a.remove()
    expect(reffed2._on.data.attach).to.be.null
  })

  it('create new observable --> a --> b remove listeners from b', function () {
    measure.a.val = {
      total: 0
    }

    a = new Observable({
      key: 'a',
      on: {
        data: function () {
          measure.a.val.total++
        }
      }
    })

    b = new a.Constructor({
      key: 'b'
    })

    // no event since it on base (emitters are base...)
    b._on.data.remove()

    a.set({
      prop1: true
    })

    expect(a._on.data).to.be.ok
    expect(b._on.data).to.be.null
  })

  it('remove on from b', function () {
    b._on.remove()

    expect(a._on).to.be.ok
    expect(b._on).to.be.null

    var foundb
    for (var key in a._on._instances) {
      if (a._on._instances[key] === b) {
        foundb = true
      }
    }

    // this is different since this requires you to remove on
    expect(foundb).msg('removed b from instances (removed on on b').to.not.be.ok

    // add test to remove _instances completely
    expect(measure.a.val.total).to.equal(2)
  })

  it('remove an instance expect listener to fire', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        data: function () {
          cnt++
        }
      }
    })
    a.remove()
    expect(cnt).to.equal(1)
  })

  it('create instances, remove count instances array', function () {
    var cnt = 0
    var i
    var a = new Observable({
      key: 'a',
      on: {
        data: function () {
          cnt++
        }
      }
    })
    var instances = []
    var derivedInstances = []
    for (i = 0; i < 10; i++) {
      instances[i] = new a.Constructor({ key: 'instanceofA' + i })
      derivedInstances[i] = new instances[i].Constructor({ key: 'derived' + i })
    }
    expect(cnt).to.equal(20)
    a.remove()
    expect(isRemoved(a)).msg('a is removed').to.be.true
    for (i = 0; i < instances.length; i++) {
      expect(isRemoved(instances[i])).msg('instance ' + i).to.be.true
    }
    for (i = 0; i < derivedInstances.length; i++) {
      expect(isRemoved(derivedInstances[i])).msg('instance ' + i).to.be.true
    }
    expect(cnt).to.equal(41)
  })

  it('remove a nested field fire listener', function () {
    var change = 0
    var propertyChange = 0
    var a = new Observable({
      key: 'a',
      on: {
        data: function () {
          change++
        },
        property: function () {
          propertyChange++
        }
      },
      b: true
    })
    a.b.remove()
    expect(change).to.equal(1)
    expect(propertyChange).msg('property').to.equal(1)
    expect(a.b).to.be.null
  })

  it('instances - remove a nested field fire listener', function () {
    var change = 0
    var propertyChange = 0
    var a = new Observable({
      key: 'a',
      on: {
        data: function () {
          change++
        },
        property: function () {
          propertyChange++
        }
      },
      b: true
    })
    expect(change).to.equal(0)

    var aInstance = new a.Constructor({key: 'aInstance'})

    expect(change).to.equal(1)

    aInstance.b.remove()

    expect(aInstance.b).to.be.not.ok
    expect(a.b.val).equals(true)
    // should not fire for a only for aInstance...
    expect(change).to.equal(2)

    expect(propertyChange).to.equal(1)
   // expect( aInstance.b ).to.be.null
  })

  it('nested (virtual) fields 1 level remove', function () {
    var cnt = {
      total: 0,
      a: 0,
      b: 0
    }
    var a = new Observable({
      key: 'a',
      trackInstances: true,
      b: {
        on: {
          data: function () {
            cnt[this.path[0]]++
            cnt.total++
          }
        }
      }
    })
    var b = new a.Constructor({
      key: 'b'
    })
    a.b.remove()
    expect(cnt.a).to.equal(1)
    expect(cnt.b).to.equal(1)
    expect(cnt.total).to.equal(2)
    expect(b.b).to.not.be.ok
    expect(a.b).to.not.be.ok
  })
  //
  it('nested (virtual) fields 2 levels remove', function () {
    //
    var cnt = {
      total: 0,
      a: 0,
      b: 0
    }
    var a = new Observable({
      key: 'a',
      trackInstances: true,
      c: {
        b: {
          on: {
            data: function () {
              cnt[this.path[0]]++
              cnt.total++
            // make parent better from context resolves current contexts and goes up
            }
          }
        }
      }
    })

    var b = new a.Constructor({
      key: 'b'
    })

    a.c.b.remove()

    expect(cnt.total).to.equal(2)
    expect(a.c.b).to.not.be.ok
    expect(a.c).to.be.ok
    expect(b.c).to.be.ok
    expect(b.c.b).msg('removed virtual child b.c.b').to.not.be.ok
    // what goes wrong? ---
    expect(cnt.b).to.equal(1)
    expect(cnt.a).to.equal(1)
  })
  //
  it('remove tests with a nested on', function () {
    // create nested removes on instances
    var cnt = 0
    var dataCnt = 0
    var a = new Observable({
      key: 'a',
      b: {
        on: {
          data: function (data, event) {
            if (data === null) {
              dataCnt++
            }
            cnt++
          }
        }
      }
    })
    a.remove()
    expect(dataCnt).to.equal(1)
    expect(cnt).to.equal(1)
  })

  it('remove tests with a deep nested on', function () {
    //
    var cnt = 0
    var dataCnt = 0
    var a = new Observable({
      key: 'a',
      b: {
        c: {
          on: {
            data: function (data, event) {
              if (data === null) {
                dataCnt++
              }
              cnt++
            }
          }
        }
      }
    })
    a.remove()
    expect(cnt).to.equal(1)
    expect(dataCnt).to.equal(1)
  })

  it('remove tests with a deep nested on and instances', function () {
    var cnt = 0
    var dataCnt = 0
    var measure = {}
    var i
    var a = new Observable({
      key: 'a',
      trackInstances: true,
      b: {
        trackInstances: true,
        c: {
          on: {
            data: function (data, event) {
              measure[this.path[0]] = !measure[this.path[0]] ? 1 : measure[this.path[0]] + 1
              if (data === null) {
                dataCnt++
              }
              cnt++
            }
          }
        }
      }
    })
    var arr = []
    for (i = 0; i < 10; i++) {
      arr.push(new a.Constructor({key: i}))
    }
    a.remove()
    expect(cnt).to.equal(11)
    expect(dataCnt).to.equal(11)
    for (i = 0; i < 10; i++) {
      expect(measure[i]).to.equal(1)
    }
  })

  describe('references', function () {
    it('reference listener fires twice', function () {
      var cnt = 0
      var a = new Observable({
        key: 'a',
        on: {
          reference: function () {
            cnt++
          }
        }
      })
      var b = new Observable({
        key: 'b',
        val: 'hello'
      })
      a.val = b
      expect(cnt).to.equal(1)
      a.remove()
      // ref does not fire (is correct did not add yet)
      expect(cnt).to.equal(2)
      expect(isRemoved(a)).to.equal(true)
      expect(b.val).to.equal('hello')
    })
  })

  describe('nested', function () {
    it('should emit change event when property is removed due to ' +
    'parent / ancestor properties being removed',
    function () {
      var a = new Observable({
        key: 'a',
        b: {
          c: true
        }
      })
      var count = 0
      a.b.c.on('data', function () {
        count++
      })
      a.b.remove()
      expect(count).to.equal(1)
    })
  })
})
