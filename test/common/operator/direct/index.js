describe('direct', function () {
  var Base = require('../../../../lib/observable')
  var obs

  it('create new observable (obs), add change listener', function () {
    obs = new Base({
      key: 'obs',
      val: 'hello',
      $add: 'gurk'
    })
    expect(obs.val).to.equal('hellogurk')
  })
})
