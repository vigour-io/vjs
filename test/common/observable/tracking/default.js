var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')


var exampleReference = new Observable ({
  exampleKey: {
    key: 'aReference'
  }
})

var exampleObservable = new Observable ({
  key: 'a',
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

it('reference (other event origin)', function (done) {

  trackerEmitter.services.test = function (obj) {
    // check for change type
    expect(obj.eventobject.eventOriginator.val).to.equal('aReference')
    done()
  }
  exampleReference.exampleKey.val = 'rick'
})

it('should contain all default keys', function (done) {
  trackerEmitter.services.test = function (obj) {
    expect(obj)
      .to.have.deep.property('eventobject')
    done()
  }
  exampleObservable.b.emit('data')
})

it('should track an error event correctly', function (done) {
  trackerEmitter.services.test = function (obj) {
    // check for error type (array || error)
    expect(obj.eventobject.metaMessage).to.be.ok
    expect(obj.eventobject.eventType.val).to.equal('error')
    done()
  }
  exampleObservable.b.emit('error')
})
