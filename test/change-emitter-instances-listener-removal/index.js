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

  it( 'create new observable --> a --> b --> c', function() {    
     a = new Observable({
      $key:'aRef',
      $val:1
     })

     b = new a.$Constructor({
      $key:'b'
     })

     c = new b.$Constructor({
      $key:'c'
     })
  })

})