describe('listeners', function () {
  var Observable = require('../../../../../lib/observable')
  var measure = {
    obs: {}
  }
  var obs

  it('create new observable (obs), add change listener', function () {
    measure.obs.val = 0
    obs = new Observable({
      key: 'obs',
      on: {
        data: function testObservable (event, meta) {

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
        data: {
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
        data: {
          third: function () {
            measure.obs.third++
          }
        }
      },
      val: 'a value'
    })
    expect(measure.obs.third).msg('third listener').to.equal(0)
    expect(measure.obs.val).msg('val listener').to.equal(1)
    expect(measure.obs.second).msg('second listener').to.equal(1)
  })

  it('change value, should fire listeners', function () {
    obs.val = 'value has changed'
    expect(measure.obs.val).msg('val listener').to.equal(2)
    expect(measure.obs.second).msg('second listener').to.equal(2)
    expect(measure.obs.third).msg('third listener').to.equal(1)
  })

  it('change value to the same, should not fire listeners', function () {
    obs.val = 'value has changed'
    expect(measure.obs.val).msg('val listener').to.equal(2)
    expect(measure.obs.second).msg('second listener').to.equal(2)
    expect(measure.obs.third).msg('third listener').to.equal(1)
  })
})
