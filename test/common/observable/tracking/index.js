console.clear()
var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')
var Event = require('../../../../lib/event/')

trackerEmitter.inject(require('../../../../lib/tracking/service/log'))
Event.prototype.inject(require('../../../../lib/event/toString'))

describe('direct tracking', function () {
  var exampleReference = new Observable({
    b: {
      $key: 'aReference'
    }
  })

  var a = new Observable({
    $key: 'a',
    b: {
      $val: exampleReference.b,
      $inject: tracking,
      $on: {
        $error: function (event, meta) {}
      },
      $track: true
    }
  })

  it('should contain all default keys', function (done) {
    trackerEmitter.$services.test = function (obj) {
      obj = obj.convert({
        plain: true
      })
      expect(obj).to.have.deep.property('eventobject')
      expect(obj).to.have.deep.property('app', 'my app id')
      expect(obj).to.have.deep.property('id', 'a > b')
      expect(obj.eventobject.eventType).to.equal('$change')
      done()
    }
    a.b.emit('$change')
  })

  it('should track an error event correctly', function (done) {
    trackerEmitter.$services.test = function (obj) {
      obj = obj.convert({
        plain: true
      })
      expect(obj.eventobject.metaMessage).to.be.ok
      expect(obj.eventobject.eventType).to.equal('$error')
      done()
    }
    a.b.emit('$error')
  })

  it('reference (other event origin)', function (done) {
    trackerEmitter.$services.test = function (obj) {
      obj = obj.convert({
        plain: true
      })
      // check for change type
      expect(obj.eventobject.eventOriginator).to.equal('aReference')
      done()
    }
    exampleReference.b.$val = 'rick'
  })

  it('should overwride id if tracking val is a string', function (done) {
    var a = new Observable({
      $inject: tracking,
      $on: {
        $change: function (event, meta) {}
      },
      $track: 'test string'
    })
    trackerEmitter.$services.test = function (obj) {
      obj = obj.convert({
        plain: true
      })
      expect(obj.id).to.have.string('test string')
      done()
    }
    a.emit('$change')
  })
  it('should handel object correctly', function (done) {
    var b = new Observable({
      $inject: tracking,
      $on: {
        $change: function (event, meta) {}
      },
      $track: {
        a: 'haa',
        b: true,
        c: [1,2,3]
      }
    })
    trackerEmitter.$services.test = function (obj) {
      obj = obj.convert({
        plain: true
      })
      expect(obj).to.have.deep.property('app')
      done()
    }
    b.emit('$change')
  })
})
