var Observable = require('../../../../../lib/observable')

describe('parent', function () {
  var Event = require('../../../../../lib/event')
  Event.prototype.inject(require('../../../../../lib/event/toString'))

  var measure = {
    a: {},
    holder: {},
    element: {}
  }

  var Element
  var holder
  var element
  var holder2

  it('create element, add to a parent', function () {
    measure.element.addToParent = {
      val: {
        total: 0
      }
    }

    measure.element.new = {
      val: {
        total: 0
      }
    }

    element = new Observable({
      on: {
        addToParent: function () {
          var keyCnt = measure.element.addToParent.val[this.key]
          measure.element.addToParent.val.total += 1
          measure.element.addToParent.val[this.key] = keyCnt ? (keyCnt + 1) : 1
        },
        new: function () {
          measure.element.new.val.total += 1
        }
      },
      useVal: true
    })
    Element = element.Constructor

    holder = new Element({ key: 'holder' })

    holder.set({
      a: new Element(),
      b: new Element(),
      c: new Element()
    })

    expect(measure.element.new.val.total).to.equal(4)
    expect(measure.element.addToParent.val.total).to.equal(3)
    expect(measure.element.addToParent.val.a).to.equal(1)
    expect(measure.element.addToParent.val.b).to.equal(1)
    expect(measure.element.addToParent.val.c).to.equal(1)
  })

  it('create new holder --> holder2', function () {
    holder2 = new holder.Constructor()
    expect(holder2).instanceof(holder.Constructor)
    expect(measure.element.new.val.total).to.equal(5)
    expect(measure.element.addToParent.val.total).to.equal(3)
  })
})

describe('add to parent one instance', function () {
  var measure = {
    a: 0,
    b: 0
  }
  var a = new Observable({
    key: 'a',
    trackInstances: true,
    on: {
      addToParent: function () {
        measure[this.key]++
      }
    }
  })

  var b = new a.Constructor({
    key: 'b'
  })

  it('should fire for own context', function () {
    var parent = new Observable({
      a: {
        useVal: a
      }
    })
    expect(parent).ok
    expect(b).instanceof(a.Constructor)
    expect(measure.a).equals(1)
    expect(measure.b).equals(0)
  })
})
