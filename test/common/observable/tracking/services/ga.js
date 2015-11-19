var trackerEmitter = require('../../../../../lib/tracking/emitter')
var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')

trackerEmitter.inject(require('../../../../../lib/tracking/service/'))

describe('Google Analytics', function(tracker) {
  var gaCall = window.ga.q

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

  it('should setup the tracker and send first pageview', function(done) {
    expect(gaCall.length).equal(10)
    done()
  })
  it('should have correct tracking beacon properties', function(done) {
    expect(gaCall[0][0]).equal('create')
    expect(gaCall[0][1]).equal('UA-43955457-5')
    expect(gaCall[0][2]).equal('auto')
    done()
  })
  it('should have correct pageview properties', function(done) {
    expect(gaCall[1][0]).equal('send')
    expect(gaCall[1][1]).equal('pageview')
    done()
  })
  it('should send event with correct properties', function(done) {
    ga(function(tracker) {
      tracker.set('sendHitTask', function(model) {
        var hitPayload = model.get('hitPayload')
          expect(hitPayload).to.be.ok
          .and.to.contain('t=event')
          .and.to.contain('ec=click')
          .and.to.contain('ea=b._on.click')
        done()
      })
    })
    a.b.emit('click')
  })
})
