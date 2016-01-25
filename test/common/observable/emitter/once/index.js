'use strict'

describe('once', function () {
  var Observable = require('../../../../../lib/observable')
  it('should be able to handle function listeners', function (done) {
    var obs = new Observable()
    obs.once(function () {
      expect(this._on.data.fn).not.ok
      done()
    })
    obs.val = 2
  })

  it('should be able to handle base listeners', function (done) {
    // this is different ofcourse
    var obs = new Observable()
    var ref = new Observable()
    obs.once(ref)
    ref.once(function () {
      expect(ref._on.data.base).not.ok
      done()
    })
    obs.val = 'hello'
  })

  it('should be able to handle set objects', function () {
    var obs = new Observable()
    obs.once({
      rick: true
    })
    obs.val = true
    expect(obs._on.data.fn).not.ok
    expect(obs._on.data.setListeners).not.ok
    obs.val = 'yuzi'
  })

  it('should be able to handle attach arrays', function (done) {
    var obs = new Observable()
    obs.once([function (data, event, keepit) {
      expect(keepit).equal(100)
      expect(obs._on.data.attach).not.ok
      done()
    }, 100])
    obs.val = 'blurf'
  })

  it('should work for other emitter types', function (done) {
    var obs = new Observable()
    obs.once('special', function () {
      done()
    })
    obs.emit('special')
  })
})
