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
    obs2:{},
    obs3:{}
  }

  var obs
  var obs2
  var obs3
  var referencedObs
  var referencedObs2

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

    expect( obs2 ).to.have.property( '$listensOnBase' )

    var keyCount = 0
    obs2.$listensOnBase.each(function(property, key) {
      keyCount++
    })
    expect( keyCount ).msg('amount of listeners on listensOnBase').to.equal( 1 )
    
    expect( obs2.$listensOnBase ).to.have.property( 1 )

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

  it('passon tests on obs3', function() {
    
    listenerCounters.obs3.val = 0

    obs3 = new Observable({
      $key: 'obs3',
      $on: {
        $change: {
          val: [ 
            function( event, meta, base, extraArg1, extraArg2 ) {
              listenerCounters.obs3.val++
              expect( extraArg1 ).to.equal( 'extra1' )
              expect( extraArg2 ).to.equal( 'extra2' )
            },
            referencedObs,
            'extra1',
            'extra2'
          ]
        }
      }
    })

    referencedObs.$val = 'lets test passon'
    expect( listenerCounters.obs3.val ).to.equal( 0 )

    expect( referencedObs ).to.have.property( '$listensOnPasson' )

    var keyCount = 0
    referencedObs.$listensOnPasson.each(function(property, key) {
      keyCount++
    })
    expect( keyCount ).msg('amount of listeners on listensOnPasson').to.equal( 1 )
    expect( referencedObs.$listensOnPasson ).to.have.property( 1 )

    obs3.$val = referencedObs
    expect( listenerCounters.obs3.val ).to.equal( 1 )
    
    referencedObs.$val = 'lets test passon, now it should fire'
    expect( listenerCounters.obs3.val ).to.equal( 2 )

  })

})