//this can become something like gaston-testor what ever to make it clear that it comes from gaston
require('tester')

chai.use(function( _chai, _ ) {
  _chai.Assertion.addMethod( 'msg', function(msg) {
    _.flag( this, 'message', msg )
  })
})

describe('$change emitter - instances', function() {

  var Observable = require('../../lib/observable')
  var measure = {
    a:{},
    instanceOfObs:{}
  }
  var a
  var b

  it( 'create new observable (a), add $change listener', function() {    
    measure.a.val = [ 0, {} ]

    a = new Observable({
      $key:'a',
      $on: {
        $change: function( event, meta ) {
          measure.a.val[0]+=1
          var keyCnt =  measure.a.val[1][this._$key] 
          measure.a.val[1][this._$key] = keyCnt ? (keyCnt+1) : 1 
          console.log('ghello?', this.$path)
        }
      }
    })
    expect( measure.a.val[0] ).to.equal( 0 )

    a.$val = 'a value'
    expect( measure.a.val[0] ).to.equal( 1 )
    expect( measure.a.val[1].a ).to.equal( 1 )
  })

  it( 'create new a.$Constructor (b), check if context is correct', function() {
    b = new a.$Constructor({
      $key:'b'
      //does work when adding your own emitter...
    })  

    expect( a.$on._instances.length )
      .msg('a.$on._instances has correct length').to.equal(1)
    expect( a.$on._instances[0] )
      .msg('b is a.$on._instances[0]').to.equal(b)

    expect( measure.a.val[0] ).to.equal( 2 )
    expect( measure.a.val[1].b ).to.equal( 1 )
  })

  it( 'change a.$val', function() {
    console.clear()
    a.$val = 'a change'
    expect( measure.a.val[1].a ).msg('a context').to.equal( 2 )
    expect( measure.a.val[1].b ).msg('b context').to.equal( 2 )
    expect( measure.a.val[0] ).to.equal( 4 )
  })

})

