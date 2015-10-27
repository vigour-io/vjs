var Obs = require('../../../../../lib/observable')

var obs = new Obs({
  x: {

  }
})

describe('Observable.once', function (done) {
  it('should fire listener only once', function (done) {
    var spy = sinon.spy()
    obs.x.once('data', spy)
    obs.x.val = 2
    obs.x.val = 3
    setTimeout(function () {
      expect(spy).calledOnce
      done()
    }, 10)
  })
})
