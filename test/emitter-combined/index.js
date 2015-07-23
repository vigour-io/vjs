describe('emitter - combined', function() {

  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')
  
  var measure = {
    a:{}
  }

  var a 
  var b
  var aRef


  it( 'create new observable --> a --> use references change a', function() {    

    measure.a.$reference = {
      val: { total: 0 }
    }   

    measure.a.$change = {
      val: { total: 0 }
    }

    measure.a.$property = {
      val: { total: 0 }
    }

    aRef = new Observable({
      $key: 'aRef',
      $val: 'a value for aRef'
    })

    a = new Observable({
      $key: 'a',
      $on: {
        $change:function( event, meta ) {
           measure.a.$change.val.total++
        },
        $reference: function( event, meta ) {
          measure.a.$reference.val.total++
        },
        $property:function( event, meta ) {
          measure.a.$property.val.total++
        }
      },
      $val: aRef
    })

    expect( aRef.$on.$change.$base[1] ).to.equal( a )

    a.$val = 10
    expect( aRef.$on.$change.$base ).to.be.null
    expect( measure.a.$reference.val.total ).to.equal( 1 )
    expect( measure.a.$change.val.total ).to.equal( 1 )

    a.$val = 20
    expect( measure.a.$reference.val.total ).to.equal( 1 )
    expect( measure.a.$change.val.total ).to.equal( 2 )
    expect( measure.a.$property.val.total ).to.equal( 0 )

    a.$set({
      $val: aRef,
      prop1:true
    })

    expect( measure.a.$reference.val.total ).to.equal( 2 )
    expect( measure.a.$change.val.total ).to.equal( 3 )
    expect( measure.a.$property.val.total ).to.equal( 1 )
    expect( aRef.$on.$change.$base[2] ).to.equal( a )

  })

})