describe('parent', function() {

  var Event = require('../../../../../lib/event')
  Event.prototype.inject( require('../../../../../lib/event/toString' ))

  var Observable = require('../../../../../lib/observable')
  var util = require('../../../../../lib/util')

  var On = require('../../../../../lib/observable/on/constructor')

  var Emitter = require('../../../../../lib/emitter')

  var measure = {
    a:{},
    holder:{},
    element:{}
  }

  var Element
  var holder
  var holder2
  var element
  var a

  it( 'create element, add to a parent', function() {

    measure.element.$addToParent = {
      val: {
        total:0
      }
    }

    measure.element.$new = {
      val: {
        total:0
      }
    }

    element = new Observable({
      $on: {
        $addToParent:function() {
          var keyCnt =  measure.element.$addToParent.val[this.$key]
          measure.element.$addToParent.val.total+=1
          measure.element.$addToParent.val[this.$key] = keyCnt ? (keyCnt+1) : 1
        },
        $new:function() {
          measure.element.$new.val.total+=1
        }
      },
      $useVal:true
    })
    Element = element.$Constructor

    holder = new Element({ $key: 'holder' })

    holder.set({
      a: new Element(),
      b: new Element(),
      c: new Element()
    })

    expect( measure.element.$new.val.total ).to.equal(4)

    expect( measure.element.$addToParent.val.total ).to.equal(3)
    expect( measure.element.$addToParent.val.a ).to.equal(1)
    expect( measure.element.$addToParent.val.b ).to.equal(1)
    expect( measure.element.$addToParent.val.c ).to.equal(1)

  })

  it( 'create new holder --> holder2', function() {
    holder2 = new holder.$Constructor()
    expect( measure.element.$new.val.total ).to.equal(5)
    expect( measure.element.$addToParent.val.total ).to.equal(3)
  })

})
