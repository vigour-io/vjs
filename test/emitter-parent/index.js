describe('emitter - parent', function() {

  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')

  var On = require('../../lib/observable/onConstructor')

  var Emitter = require('../../lib/emitter')
  
  var measure = {
    a:{},
    holder:{},
    element:{}
  }

  var Element
  var holder
  var element
  var a 

  it( 'create element, add to a parent', function() {

    measure.element.$addToParent = {
      val: {
        total:0
      }
    }

    element = new Observable({
      $on: {
        $addToParent:function() {
          var keyCnt =  measure.element.$addToParent.val[this._$key] 
          measure.element.$addToParent.val.total+=1
          measure.element.$addToParent.val[this._$key] = keyCnt ? (keyCnt+1) : 1 
        },
        $new:function() {
          console.log( 'new element!', this.$path )
        }
      },
      $useVal:true
    })
    Element = element.$Constructor

    var holder = new Element({ $key: 'holder' })

    holder.$set({
      a: new Element(),
      b: new Element(),
      c: new Element()
    })

    expect( measure.element.$addToParent.val.total ).to.equal(3)
    expect( measure.element.$addToParent.val.a ).to.equal(1)
    expect( measure.element.$addToParent.val.b ).to.equal(1)
    expect( measure.element.$addToParent.val.c ).to.equal(1)


  })

  
})