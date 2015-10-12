describe('fire error event', function () {
  var ErrorEmitter = require('../../../lib/emitter/error')
  var error = new ErrorEmitter()
  var Event = require('../../../lib/event')

  it('can fire for multiple error events', function () {
    var event = new Event()
    event.isTriggered = true
    error.on(listener)
    error.emit('a', event)
    error.emit('b', event)
    event.trigger()
    function listener (data, event) {
      this.data = data
    }
    expect(error.data).to.eql(["a", "b"])
  })
})
