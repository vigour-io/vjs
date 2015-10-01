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
})
