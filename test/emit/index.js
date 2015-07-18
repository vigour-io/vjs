//this can become something like gaston-testor what ever to make it clear that it comes from gaston
require('tester')

chai.use(function( _chai, _ ) {
  _chai.Assertion.addMethod( 'msg', function(msg) {
    _.flag( this, 'message', msg )
  })
})

describe('Emit', function() {

  var Observable = require('../../lib/observable')
  var obs
  var listenerCounters = {
    obs:{}
  }

  it('create new observable (obs), add $change listener', function() {
    listenerCounters.obs.val = 0

    obs = new Observable({
      $key:'obs',
      $on: {
        $change: function( event, meta ) {
          console.log('fire!')
          listenerCounters.obs.val++
        }
      }
    })

    expect( listenerCounters.obs.val ).to.equal( 0 )
  })

  it('add extra $change listener on obs ', function() {
    listenerCounters.obs.second = 0

    obs.$set({
      $on: {
        $change: {
          second: function() {
            listenerCounters.obs.second++
          }
        }
      }
    })

    expect( listenerCounters.obs.val ).msg( 'val listener' ).to.equal( 1 )
    expect( listenerCounters.obs.second ).msg( 'second listener' ).to.equal( 0 )
  })

})