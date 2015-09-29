describe('no instances', function () {
  var Event = require('../../../../../lib/event')
  Event.prototype.inject(require('../../../../../lib/event/toString'))

  var Observable = require('../../../../../lib/observable')
  var measure = {
    obs: {},
    obs2: {},
    obs3: {},
    obs4: {}
  }

  var obs
  var obs2
  var obs3
  var obs4
  var referencedObs
  var referencedObs2

  it('create new observable (obs), add $change listener', function () {
    measure.obs.val = 0

    obs = new Observable({
      $key: 'obs',
      $on: {
        $data: function ( event, meta ) {
          measure.obs.val++
        }
      }
    })

    expect(measure.obs.val).to.equal(0)

  })

  it('add extra $change listeners on obs ', function () {
    measure.obs.second = 0

    obs.set({
      $on: {
        $data: {
          second: function () {
            measure.obs.second++
          }
        }
      }
    })

    expect(measure.obs.val).msg('val listener').to.equal(0)
    expect(measure.obs.second).msg('second listener').to.equal(0)

    measure.obs.third = 0

    obs.set({
      $on: {
        $data: {
          third: function () {
            measure.obs.third++
          }
        }
      },
      $val: 'a value'
    })

    expect(measure.obs.val).msg('val listener').to.equal(1)
    expect(measure.obs.second).msg('second listener').to.equal(1)
    expect(measure.obs.third).msg('third listener').to.equal(0)

    obs.$val = 'value has changed'

    expect(measure.obs.val).msg('val listener').to.equal(2)
    expect(measure.obs.second).msg('second listener').to.equal(2)
    expect(measure.obs.third).msg('third listener').to.equal(1)

    obs.$val = 'value has changed'

    // value is the same so expect zero changes
    expect(measure.obs.val).msg('val listener').to.equal(2)
    expect(measure.obs.second).msg('second listener').to.equal(2)
    expect(measure.obs.third).msg('third listener').to.equal(1)

  })

  it('references tests on obs2', function () {
    measure.obs2.val = 0

    referencedObs = new Observable({
      $key: 'referencedObs',
      $val: 'a string'
    })

    referencedObs2 = new Observable({
      $key: 'referencedObs',
      $val: 'a string'
    })

    obs2 = new Observable({
      $key: 'obs2',
      $on: {
        $data: {
          val: function () {
            measure.obs2.val++
          }
        }
      },
      $val: referencedObs
    })

    expect(measure.obs2.val).msg('val listener').to.equal(0)

    expect(obs2).to.have.property('$listensOnBase')

    var keyCount = 0
    obs2.$listensOnBase.each(function (property, key) {
      keyCount++
    })

    expect(keyCount).msg('amount of listeners on listensOnBase').to.equal(1)

    expect(obs2.$listensOnBase).to.have.property(1)

    referencedObs.$val = 'changed a string'

    expect(measure.obs2.val).msg('val listener').to.equal(1)

    obs2.$val = referencedObs2

    expect(measure.obs2.val).msg('val listener').to.equal(2)

    obs2.$val = referencedObs2

    // value is the same so expect zero change
    expect(measure.obs2.val).msg('val listener').to.equal(2)

    referencedObs2.$val = 'changed a string'

    expect(measure.obs2.val).msg('val listener').to.equal(3)

  })

  it('attach tests on obs3', function () {
    measure.obs3.val = 0

    obs3 = new Observable({
      $key: 'obs3',
      $on: {
        $data: {
          val: [
            function ( event, meta, base, extraArg1, extraArg2 ) {
              measure.obs3.val++
              expect(extraArg1).to.equal('extra1')
              expect(extraArg2).to.equal('extra2')
            },
            referencedObs,
            'extra1',
            'extra2'
          ]
        }
      }
    })

    referencedObs.$val = 'lets test attach'
    expect(measure.obs3.val).to.equal(0)

    expect(referencedObs).to.have.property('$listensOnAttach')

    var keyCount = 0
    referencedObs.$listensOnAttach.each(function ( property, key ) {
      keyCount++
    })
    expect(keyCount).msg('amount of listeners on listensOnAttach')
      .to.equal(1)
    expect(referencedObs.$listensOnAttach).to.have.property(1)

    obs3.$val = referencedObs
    expect(measure.obs3.val).to.equal(1)

    referencedObs.$val = 'lets test attach, now it should fire'
    expect(measure.obs3.val).to.equal(2)

  })

  it('use $block on a new observable --> obs4', function () {
    var cnt = 0
    var cnt2 = 0

    var obs4 = new Observable({
      $key: 'obs4',
      specialField: {
        $on: {
          $data: function () {
            expect(this.$val).msg('specialField').to.equal('hello')
            cnt2++
          }
        }
      },
      $on: {
        $data: function (event) {
          cnt++
          event.$block = true

          this.set({
            specialField: 'xxxx',
            letsSee: true
          }, event)

          this.set({
            specialField: 'hello'
          }, event)

          event.$block = null
        }
      }
    })

    expect(cnt).msg('obs4 listener fired').to.equal(0)
    expect(cnt2).msg('specialField fired').to.equal(0)

    obs4.set({ hello: true })

    expect(cnt).msg('obs4 listener fired').to.equal(1)
    expect(cnt2).msg('specialField fired').to.equal(1)

  })

  it('change nested fields , fire correct emitters', function () {
    var measure = {
      a: 0,
      x: 0
    }
    var a = new Observable({
      $key: 'a',
      $on: {
        $data: function () {
          measure.a++
        }
      },
      x: {
        $on: {
          $data: function ( event, meta ) {
            measure.x++
          }
        }
      }
    })
    a.set({
      x: true
    })
    expect(measure.a).to.equal(0)
    expect(measure.x).to.equal(1)
  })

  it('should emit change event when property is removed due to ' +
  'parent / ancestor properties being removed',
    function () {
      var a = new Observable({
        $key: 'a',
        b: {
          c: true
        }
      })
      var count = 0
      a.b.c.on('$change', function () {
        count++
      })
      a.b.remove()
      expect(count).to.equal(1)
    }
  )

  it('should emit fire once for specific value (.fire)',
    function () {
      var a = new Observable({
        $key: 'a',
        b: {
          c: true
        }
      })
      function listener () {
        count++
      }
      var count = 0
      a.b.c.on('$change', listener)
      a.b.c.$on.$change.fire(listener)
      expect(count).to.equal(1)
    }
  )

})
