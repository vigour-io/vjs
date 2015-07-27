describe('$change emitter - instances - listener - removal', function() {

  var Observable = require('../../../lib/observable')
  var util = require('../../../lib/util')
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

     console.log(a.$on.$change.$fn)

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
     expect( a.$on.$change.$fn.other ).msg('$fn.other').to.be.ok
     expect( a.$on.$change.$fn.special ).msg('$fn.special').to.be.null

     //remove fn if its completely empty
     a.$on.$change.$fn.$removeProperty( a.$on.$change.$fn.other, 'other' )

     console.info('ghello why is it gone???!@#', a.$on.$change.$fn)
     console.info(util.isEmpty(a.$on.$change.$fn))

     expect( a.$on.$change.$fn ).msg('$fn').to.be.null
    
  })

})