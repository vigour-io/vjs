describe('$change emitter - instances - listener - removal', function() {

  var Observable = require('../../lib/observable')
  var measure = {
    a:{},
    b:{},
    c:{},
    aRef:{},
    bRef:{}
  }
  var aRef
  var bRef
  var a
  var b
  var c

  it( 'create new observable --> a, overwrite different types of keys', function() {    

     aRef = new Observable({
      $key: 'aRef',
      $val: 'a value for aRef'
     })

     a = new Observable({
      $key: 'a',
      $on: {
        $change: {
          other: function() {},
          special: function() {}
        }
      },
      $val: 1
     })

     a.$set({
      $on: {
        $change: {
          special: [ function() {
            console.log('passon!')
          }, aRef ]
        }
      }
     })

     //same for passon and base
     expect( a.$on.$change.$fn ).to.not.have.property( 'special' )

     a.$on.$change.$special.$removeProperty( 'other' ) 

     //remove fn if its completely empty
     expect( a.$on.$change ).to.not.have.property( 'other' )
    

  })

})