var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')
var trackerEmitter = require('../../../../../lib/tracking/emitter')

describe('default', function () {
  var exampleReference = new Observable({
    exampleKey: {
      key: 'aReference'
    }
  })

  var exampleObservable = new Observable({
    b: {
      val: exampleReference.exampleKey,
      inject: tracking,
      on: {
        data: function (data, event) {},
        error: function (data, event) {}
      },
      track: true
    }
  })

  let bInstance = new exampleObservable.Constructor({
    key: 'a'
  })

  it('reference (other event origin)', function (done) {
    trackerEmitter.services.test = function (obj) {
      expect(obj.eventObject.eventOriginator.val).to.equal('aReference')
      done()
    }
    exampleReference.exampleKey.val = 'rick'
    delete trackerEmitter.services.test
  })

  it('should contain all default keys', function (done) {
    trackerEmitter.services.test = function (obj) {
      expect(obj.id.val).to.equal('a.b._on.data')
      expect(obj.app.val).to.equal('my app id')
      expect(obj).to.have.deep.property('eventObject')
      expect(obj.eventObject.eventOriginator.val).to.equal('a')
      expect(obj.eventObject.eventType.val).to.equal('data')
      done()
    }
    bInstance.b.emit('data')
    delete trackerEmitter.services.test
  })

  it('should track an error event correctly', function (done) {
    trackerEmitter.services.test = function (obj) {
      expect(obj.eventObject.metaMessage).to.be.ok
      expect(obj.eventObject.eventType.val).to.equal('error')
      done()
    }
    bInstance.b.emit('error')
    delete trackerEmitter.services.test
  })
})
