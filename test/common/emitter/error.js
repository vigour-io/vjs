describe('error emitter', function () {
  var ErrorEmitter = require('../../../lib/emitter/error')
  var Event = require('../../../lib/event')

  describe('single emit', function () {
    var emitter = new ErrorEmitter()
    it('creates an error and fires it, data is single error', function () {
      var event = new Event()
      event.isTriggered = true
      emitter.on(listener)
      emitter.emit(void 0, event)
      event.trigger()
      function listener (data, event) {
        this.data = data
      }
      expect(emitter.data).instanceof(Error)
    })
  })

  describe('multiple emits', function () {
    var emitter = new ErrorEmitter()
    var path
    var data
    function listener (data, event) {
      this.data = data
    }
    it('fires for multiple error events', function () {
      var event = new Event()
      event.isTriggered = true
      emitter.on(listener)
      emitter.emit('a', event)
      emitter.emit('b', event)
      event.trigger()
      data = emitter.data
      path = emitter.path.join('.')
    })

    it('returns an array as data', function () {
      expect(data).instanceof(Array)
    })

    it('has field [0]', function () {
      expect(data[0]).instanceof(Error)
    })

    it('[0] has the correct message', function () {
      expect(data[0]).property('message').which.equals(path + ' a')
    })

    it('has field [1]', function () {
      expect(data[1]).instanceof(Error)
    })

    it('[1] has the correct message', function () {
      expect(data[1]).property('message').which.equals(path + ' b')
    })
  })
})
