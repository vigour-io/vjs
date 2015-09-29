describe('references', function () {
  var Observable = require('../../../../../lib/observable')
  var measure = {
    obs: {}
  }
  var referencedObs, referencedObs2, obs

  it('create reference observables', function () {
    measure.obs.val = 0
    referencedObs = new Observable({
      key: 'referencedObs',
      val: 'a string'
    })
    obs = new Observable({
      key: 'obs2',
      on: {
        data: {
          val: function () {
            measure.obs.val++
          }
        }
      },
      val: referencedObs
    })
    expect(measure.obs.val).msg('val listener').to.equal(0)
    expect(obs).to.have.property('listensOnBase')
  })

  it('should have added a listener on the referenced observable', function () {
    expect(referencedObs._on.data.base).ok
    expect(referencedObs._on.data.base[1]).equals(obs)
  })

  it('should have correct listen object', function () {
    var keyCount = 0
    obs.listensOnBase.each(function (property, key) {
      keyCount++
    })
    expect(keyCount).msg('amount of emitters on listensOnBase').to.equal(1)
    expect(obs.listensOnBase[1]).msg('equal referencedObs change emitter')
      .to.equal(referencedObs._on.data)
  })

  it('should create the correct key for the listener', function () {
    expect(obs.listensOnBase).to.have.property(1)
  })

  it('changing value on referenced observable should fire listener', function () {
    referencedObs.val = 'changed a string'
    expect(measure.obs.val).msg('val listener').to.equal(1)
  })

  it('changing value to another observable should fire listeners', function () {
    referencedObs2 = new Observable({
      key: 'referencedObs',
      val: 'a string'
    })
    obs.val = referencedObs2
    expect(measure.obs.val).msg('val listener').to.equal(2)
  })

  it('should have added listeners on the new referenced object', function () {
    expect(referencedObs2._on.data.base).be.ok
    expect(referencedObs2._on.data.base[1]).equals(obs)
  })

  it('should have removed listeners on the previous value', function () {
    expect(referencedObs._on.data.base).not.ok
  })

  it('should have correct listen object', function () {
    var keyCount = 0
    obs.listensOnBase.each(function (property, key) {
      keyCount++
    })
    expect(keyCount).msg('amount of emitters on listensOnBase').to.equal(1)
    expect(obs.listensOnBase[2]).msg('equal referencedObs2 change emitter')
      .to.equal(referencedObs2._on.data)
  })

  it('should not fire when val is the same', function () {
    obs.val = referencedObs2
    expect(measure.obs.val).msg('val listener').to.equal(2)
  })

  it('should fire when changing referenced observable', function () {
    referencedObs2.val = 'changed a string'
    expect(measure.obs.val).msg('val listener').to.equal(3)
  })
})
