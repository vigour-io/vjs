describe('error emitter', function () {
  var ErrorEmitter = require('../../../lib/emitter/error')
  var error = new ErrorEmitter()
  var Event = require('../../../lib/event')

  it('creates an error and fires it, data is single error', function () {
    var event = new Event()
    event.isTriggered = true
    error.on(listener)
    error.emit(void 0, event)
    event.trigger()
    function listener (data, event) {
      this.data = data
    }
    expect(error.data).instanceof(Error)
  })

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
