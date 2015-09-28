var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')
var Event = require('../../../../lib/event/')

trackerEmitter.inject(require('../../../../lib/tracking/service/log'))
Event.prototype.inject(require('../../../../lib/event/toString'))

// this is just to log stuff (.toString yields nicer result for events)
var Event = require('../../../../lib/event/')
Event.prototype.inject(require('../../../../lib/event/toString'))

describe('direct tracking', function () {
  it('should contain all default keys', function (done) {
    var a = new Observable({
      $key: 'a',
      b: {
        $inject: tracking,
        $on: {
          $error: function ( event, meta ) {}
        },
        $track: true
      }
    })

    trackerEmitter.$services.test = function ( obj ) {

      expect(obj)
        .to.have.deep.property('eventobject')
      done()
    }
    a.b.emit('$change')
  })

  it('should track an error event correctly', function (done) {
    var a = new Observable({
      $key: 'a',
      b: {
        $inject: tracking,
        $on: {
          $error: function ( event, meta ) {}
        },
        $track: true
      }
    })

    trackerEmitter.$services.test = function ( obj ) {
      // check for error type
      expect(obj.eventobject.metaMessage).to.be.ok
      expect(obj.eventobject.eventType).to.equal('$error')
      done()
    }
    a.b.emit('$error')
  })

  it('reference (other event origin)', function (done) {
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
          $error: function ( event, meta ) {}
        },
        $track: true
      }
    })

    trackerEmitter.$services.test = function ( obj ) {
      // check for change type

      expect(obj.eventobject.eventOriginator.$val).to.equal('aReference')
      done()
    }
    exampleReference.b.$val = 'rick'
  })

  it('should overwride id if tracking val is a string', function (done) {
    var a = new Observable({
      $key: 'a',
      b: {
        $inject: tracking,
        $on: {
          $error: function ( event, meta ) {}
        },
        $track: 'test string'
      }
    })

    trackerEmitter.$services.test = function ( obj ) {
      expect(obj.id.$val).to.have.string('test string')
      done()
    }
    b.emit('$change')
  })
})
