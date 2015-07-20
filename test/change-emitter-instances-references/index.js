describe('$change emitter - instances - references', function() {

  var Observable = require('../../lib/observable')
  var measure = {
    a:{},
    b:{},
    c:{},
    aRef:{}
  }
  var aRef
  var a
  var b
  var c

  it( 'create new observable --> aRef, add change listener "val"', function() {    
    //making new instances manges reference updates
     aRef = new Observable({
      $key:'aRef',
      $val:1
     })
  })

  it( 'create new observable --> a, add change listener "val"', function() {    
    measure.a.val = { total: 0 }

    a = new Observable({
      $key:'a',
      $on: {
        $change: function( event, meta ) {
          var keyCnt =  measure.a.val[this._$key] 
          measure.a.val.total+=1
          measure.a.val[this._$key] = keyCnt ? (keyCnt+1) : 1 
        }
      }
    })
    expect( measure.a.val.total ).to.equal( 0 )

    a.$val = aRef
    expect( measure.a.val.a ).to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 1 )
  })

  it( 'create new a --> b', function() {
    b = new a.$Constructor({
      $key:'b'
    })  
    expect( measure.a.val.b ).to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 2 )
  })

  it( 'change aRef', function() {
    aRef.$val = 'a change'
    expect( measure.a.val.a ).msg('a context').to.equal( 2 )
    expect( measure.a.val.b ).msg('b context').to.equal( 2 )
    expect( measure.a.val.total ).to.equal( 4 )
  })

})