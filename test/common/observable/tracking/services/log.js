var trackerEmitter = require('../../../../../lib/tracking/emitter')
var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')

trackerEmitter.inject(require('../../../../../lib/tracking/service/log'))

describe('Log service with Array', function () {
  var example = ['new', 'parent', 'click', 'remove']
  var a = new Observable({
    b: {
      inject: tracking,
      on: {
        data: function(event, meta) {}
      },
      track: example
    }
  })

  var bInstance = new a.Constructor ({

  })

  it('should log plain object with datalayer content', function () {
    var expected = {
      app: "my app id",
      eventobject: {
        eventOriginator: "b",
        eventType: "click",
        stamp: 4
      },
      id: "b._on.click"
    }
    trackerEmitter.services.test = function (obj) {
      expect(obj.plain()).to.eql(expected)
    }
    bInstance.b.emit(example[2])
    delete trackerEmitter.services.test
  })
  it('should fire once if one event is emitted', function () {
    var cnt = 0
    trackerEmitter.services.test = function (obj) {
      cnt ++
    }
    bInstance.b.emit(example[0])
    expect(cnt).to.equal(1)
    delete trackerEmitter.services.test
  })

  it('should fire multiple times if multiple events are emitted', function () {
    var cnt = 0
    trackerEmitter.services.test = function (obj) {
      cnt ++
    }
    bInstance.b.emit(example[0])
    bInstance.b.emit(example[1])
    bInstance.b.emit(example[2])
    bInstance.b.remove()

    delete trackerEmitter.services.test
    // bInstance.b.emit(example[2])
  })
})
