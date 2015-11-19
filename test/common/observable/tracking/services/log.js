var trackerEmitter = require('../../../../../lib/tracking/emitter')
var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')

trackerEmitter.inject(require('../../../../../lib/tracking/service/'))

describe('Log', function() {

  beforeEach(function() {
    sandbox = sinon.sandbox.create()
    sandbox.stub(window.console, "log")
    sandbox.stub(window.console, "error")
  })

  afterEach(function () {
    sandbox.restore()
  })

  var example = ['click', 'lol']
  var a = new Observable({
    b: {
      inject: tracking,
      on: {
        data: function(event, meta) {}
      },
      track: example
    }
  })

  var bInstance = new a.Constructor({

  })

  it('should fire log once', function(done) {
    var cnt = 0
    var logSpy = sinon.spy(trackerEmitter.services,'log')
    a.b.emit('click')
    expect(logSpy.calledOnce)
    sinon.assert.calledWithMatch(console.log, "TRACKER LOGGER:")
    done()
  })
})
