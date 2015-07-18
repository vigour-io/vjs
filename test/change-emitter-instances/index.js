//this can become something like gaston-testor what ever to make it clear that it comes from gaston
require('tester')

chai.use(function( _chai, _ ) {
  _chai.Assertion.addMethod( 'msg', function(msg) {
    _.flag( this, 'message', msg )
  })
})

describe('$change emitter - instances', function() {

  var Observable = require('../../lib/observable')
  var listenerCountersAndContext = {
    obs:{},
  }

  it('create new observable (obs), add $change listener', function() {
    
    listenerCountersAndContext.obs.val = [ 0 ]

    obs = new Observable({
      $key:'obs',
      $on: {
        $change: function( event, meta ) {
          listenerCountersAndContext.obs.val[0]++
          listenerCountersAndContext.obs.val[1] = this._$key
        }
      }
    })

    expect( listenerCountersAndContext.obs.val[0] ).to.equal( 0 )

    obs.$val = 'a value'
    expect( listenerCountersAndContext.obs.val[0] ).to.equal( 1 )
    expect( listenerCountersAndContext.obs.val[1] ).to.equal( obs._$key )

  })

})