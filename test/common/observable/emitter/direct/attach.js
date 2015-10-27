describe('attach', function () {
  var Observable = require('../../../../../lib/observable')
  var measure = {
    obs: { val: 0 }
  }
  var referencedObs, obs

  it('should create a listens on Attach object', function () {
    referencedObs = new Observable({
      key: 'referencedObs',
      val: 'a string'
    })
    obs = new Observable({
      key: 'obs',
      on: {
        data: {
          val: [
            function (event, meta, base, extraArg1, extraArg2) {
              measure.obs.val++
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
    expect(referencedObs).have.property('listensOnAttach')
    expect(obs._on.data.attach).ok
  })

  it('should have the correct amount of attached properties', function () {
    var keyCount = 0
    referencedObs.listensOnAttach.each(function (property, key) {
      keyCount++
    })
    expect(keyCount).msg('amount of listeners on listensOnAttach').equals(1)
  })

  it('should not fire for referenced observable', function () {
    referencedObs.val = 'lets test attach'
    expect(measure.obs.val).to.equal(0)
  })

  it('should not fire for referenced observable', function () {
    obs.val = referencedObs
    expect(measure.obs.val).to.equal(1)
    referencedObs.val = 'lets test attach, now it should fire'
    expect(measure.obs.val).to.equal(2)
  })
})
