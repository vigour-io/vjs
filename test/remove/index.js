describe('remove', function() {

  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')
  var measure = {}
  var a

  it( 'create new observable --> a and remove using method', function() {    
    a = new Observable({
      $key:'a',
      $val:1
    })
    a.remove()
    expect(a).to.be.empty
  })

  it( 'create new observable --> a and remove using a set with null', function() {    
    a = new Observable({
      $key:'a',
      $val:1
    }) 
    a.$val = null  
    expect(a).to.be.empty
  })

  it( 'create new observable --> a and remove field blarf', function() {    
    a = new Observable({
      $key:'a',
      $blarf:true
    }) 
    a.$blarf.$val = null  
    expect(a.$blarf).to.be.an('undefined');
  })

})