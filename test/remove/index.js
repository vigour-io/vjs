describe('$change emitter - instances - references', function() {

  var Observable = require('../../lib/observable')
  var measure = {}
  var a

  it( 'create new observable --> a', function() {    
    //making new instances manges reference updates
     a = new Observable({
      $key:'a',
      $val:1
     })

     
  })

})