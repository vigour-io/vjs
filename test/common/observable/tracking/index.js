console.clear()

var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var DataLayer = require('../../../../lib/tracking/datalayer')
var trackerEmitter = require('../../../../lib/tracking/emitter')

trackerEmitter.inject(require('../../../../lib/tracking/service/log'))

//this is just to log stuff (.toString yields nicer result for events)
var Event = require('../../../../lib/event/')
Event.prototype.inject( require('../../../../lib/event/toString') )

describe('direct tracking', function() {
  it('should contain all default keys', function(done) {
    var a = new Observable({
      $key:'a',
      b: {
        $inject: tracking,
        $on: {
          $error: function( event, meta ) {}
        },
        $track:true
      }
    })

    trackerEmitter.$services.test = function( obj ) {
      console.log('obj.keys', obj)
      expect(obj)
        .to.have.deep.property('eventobject')
      done()
    }
    a.b.emit('$change')
  })

  it('should track an error event correctly', function(done) {
    var a = new Observable({
      $key:'a',
      b: {
        $inject: tracking,
        $on: {
          $error: function( event, meta ) {}
        },
        $track:true
      }
    })

    trackerEmitter.$services.test = function( obj ) {
      //check for error type
      expect(obj.eventobject.metaMessage).to.be.ok
      done()
    }
    a.b.emit('$error')
  })

  it('reference (other event origin)', function(done) {

    var aReference = new Observable({$key:'aReference'})

    var a = new Observable({
      $key:'a',
      b: {
        $val: aReference,
        $inject: tracking,
        $on: {
          $error: function( event, meta ) {}
        },
        $track:true
      }
    })

    trackerEmitter.$services.test = function( obj ) {
      //check for change type
      expect(obj.eventobject.eventOriginator._$val.$key).to.equal('aReference')
      done()
    }
    aReference.$val = 'rick'
  })
  it('should overwride id if tracking val is a string', function(done) {

    var a = new Observable({
      $key:'a',
      b: {
        $inject: tracking,
        $on: {
          $error: function( event, meta ) {}
        },
        $track: 'test string'
      }
    })

    trackerEmitter.$services.test = function( obj ) {
      expect(obj.id.$val).to.have.string('test string');
      done()
    }
    a.b.emit('$error')
  })
})
