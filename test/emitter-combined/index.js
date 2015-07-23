describe('emitter - combined', function() {

  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')
  
  var measure = {
    a:{}
  }

  var a 
  var b
  var aRef


  it( 'create new observable --> a', function() {    
     aRef = new Observable({
      $key: 'aRef',
      $val: 'a value for aRef'
     })

     a = new Observable({
      $key: 'a',
      $on: {
        $change:function() {
          console.log('lemme fire!')
        }
      },
      $val: aRef
     })

     a.$val = 10

  })

})