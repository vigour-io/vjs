'use strict'

describe('is', function () {
  var Observable = require('../../../../lib/observable')
  var obs = new Observable({
    inject: require('../../../../lib/observable/is')
  })
  it('should fire the listener when value is "leo"', function (done) {
    obs.is('leo', function () {
      expect(this._on.data.fn).not.ok
      done()
    })
    obs.val = 'leo'
  })

  it('should fire the listener when value is "leo" immediately', function (done) {
    obs.is('leo', function () {
      expect(this._on.data.fn).not.ok
      done()
    })
  })

  it('should fire the listener when value is "leo" promised', function (done) {
    obs.is('leo').then(function (target, data, event) {
      expect(target).equals(obs)
      done()
    })
  })

  it('should fire the listener when value is larger then 10 promised', function (done) {
    obs.is((val) => val > 10).then(function () {
      done()
    })
    obs.val = 20
  })
})
