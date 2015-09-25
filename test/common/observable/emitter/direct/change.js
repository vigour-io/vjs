describe('listeners', function () {
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

  it('create new observable (obs)', function () {
    var specialobs = new Observable(10)
    expect(specialobs).instanceof(Observable)
    expect(specialobs.val).equals(10)
  })

  it('create new observable (obs), add change listener', function () {
    measure.obs.val = 0
    obs = new Observable({
      key: 'obs',
      on: {
        change: function testObservable (event, meta) {
          measure.obs.val++
        }
      }
    })
    expect(measure.obs.val).to.equal(0)
  })

  it('add extra change listeners on obs ', function () {
    measure.obs.second = 0
    obs.set({
      on: {
        change: {
          second: function () {
            measure.obs.second++
          }
        }
      }
    })
    expect(measure.obs.val).msg('val listener').to.equal(0)
    expect(measure.obs.second).msg('second listener').to.equal(0)
  })

  it('add third change listener on obs, set obs', function () {
    measure.obs.third = 0
    obs.set({
      on: {
        change: {
          third: function () {
            measure.obs.third++
          }
        }
      },
      val: 'a value'
    })
    expect(measure.obs.third).msg('third listener').to.equal(0)
    expect(measure.obs.second).msg('second listener').to.equal(1)
    expect(measure.obs.val).msg('val listener').to.equal(1)
  })

  //
  //   obs.val = 'value has changed'
  //
  //   expect(measure.obs.val).msg('val listener').to.equal(2)
  //   expect(measure.obs.second).msg('second listener').to.equal(2)
  //   expect(measure.obs.third).msg('third listener').to.equal(1)
  //
  //   obs.val = 'value has changed'
  //
  //   // value is the same so expect zero changes
  //   expect(measure.obs.val).msg('val listener').to.equal(2)
  //   expect(measure.obs.second).msg('second listener').to.equal(2)
  //   expect(measure.obs.third).msg('third listener').to.equal(1)
  // })
})
