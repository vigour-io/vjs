//this can become something like gaston-testor what ever to make it clear that it comes from gaston
require('tester')

chai.use(function( _chai, _ ) {
  _chai.Assertion.addMethod( 'msg', function(msg) {
    _.flag( this, 'message', msg )
  })
})

describe('$change emitter - no instances', function() {

  var Observable = require('../../lib/observable')
  var listenerCounters = {
    obs:{},
    obs2:{}
  }

  var obs
  var obs2
  var referencedObs

  it('create new observable (obs), add $change listener', function() {
    
    listenerCounters.obs.val = 0

    obs = new Observable({
      $key:'obs',
      $on: {
        $change: function( event, meta ) {
          listenerCounters.obs.val++
        }
      }
    })

    expect( listenerCounters.obs.val ).to.equal( 0 )

  })

  it('add extra $change listeners on obs ', function() {
    
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

    expect( listenerCounters.obs.val ).msg( 'val listener' ).to.equal( 0 )
    expect( listenerCounters.obs.second ).msg( 'second listener' ).to.equal( 0 )

    listenerCounters.obs.third = 0

    obs.$set({
      $on: {
        $change: {
          third: function() {
            listenerCounters.obs.third++
          }
        }
      },
      $val:'a value'
    })

    expect( listenerCounters.obs.val ).msg( 'val listener' ).to.equal( 1 )
    expect( listenerCounters.obs.second ).msg( 'second listener' ).to.equal( 1 )
    expect( listenerCounters.obs.third ).msg( 'third listener' ).to.equal( 0 )

    obs.$val = 'value has changed'

    expect( listenerCounters.obs.val ).msg( 'val listener' ).to.equal( 2 )
    expect( listenerCounters.obs.second ).msg( 'second listener' ).to.equal( 2 )
    expect( listenerCounters.obs.third ).msg( 'third listener' ).to.equal( 1 )

    obs.$val = 'value has changed'

    //value is the same so expect zero changes
    expect( listenerCounters.obs.val ).msg( 'val listener' ).to.equal( 2 )
    expect( listenerCounters.obs.second ).msg( 'second listener' ).to.equal( 2 )
    expect( listenerCounters.obs.third ).msg( 'third listener' ).to.equal( 1 )

  })

  it('references tests on obs2', function() {
    
    listenerCounters.obs2.val = 0

    referencedObs = new Observable({
      $key:'referencedObs',
      $val:'a string'
    })

    referencedObs2 = new Observable({
      $key:'referencedObs',
      $val:'a string'
    })

    obs2 = new Observable({
      $key: 'obs2',
      $on: {
        $change: {
          val: function() {
            listenerCounters.obs2.val++
          }
        }
      },
      $val: referencedObs
    })

    expect( listenerCounters.obs2.val ).msg( 'val listener' ).to.equal( 0 )

    referencedObs.$val = 'changed a string'

    expect( listenerCounters.obs2.val ).msg( 'val listener' ).to.equal( 1 )

    obs2.$val = referencedObs2

    expect( listenerCounters.obs2.val ).msg( 'val listener' ).to.equal( 2 )

    obs2.$val = referencedObs2

    //value is the same so expect zero change
    expect( listenerCounters.obs2.val ).msg( 'val listener' ).to.equal( 2 )

    referencedObs2.$val = 'changed a string'

    expect( listenerCounters.obs2.val ).msg( 'val listener' ).to.equal( 3 )

  })

})