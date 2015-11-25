'use strict'

describe('once', function () {
  var Emitter = require('../../../lib/emitter')
  var a = new Emitter()
  it('fires once, listener gets removed', function (done) {
    a.once(function () {
      console.log('hey')
      // epxect(a.fn)
      done()
    })
    a.emit('data')
  })
})
