describe('emitter - combined', function() {

  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')

  var On = require('../../lib/observable/onConstructor')

  var Emitter = require('../../lib/emitter')
  
  var measure = {
    a:{},
    holder:{}
  }

  var Element
  var holder
  var a 

  it( 'create element', function() {
    var element = new Observable({
      $on: {
        $addToParent:function() {
          console.log('add to parent!', this.$path)
        },
        $new:function() {
          console.log( 'new element!', this.$path )
        }
      },
      $useVal:true
    })
    Element = element.$Constructor
  })

  it( 'create new observables, add to parent', function() {    
    var holder = new Element({ $key: 'holder' })

    holder.$set({
      a: new Element(),
      b: new Element(),
      c: new Element()
    })

  })

  
})