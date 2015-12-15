'use strict'
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
    measure.element.parent = {
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
        parent() {
            var keyCnt = measure.element.parent.val[this.key]
            measure.element.parent.val.total += 1
            measure.element.parent.val[this.key] = keyCnt ? (keyCnt + 1) : 1
          },
          new() {
            measure.element.new.val.total += 1
          }
      },
      useVal: true
    })
    Element = element.Constructor

    holder = new Element({
      key: 'holder'
    })

    holder.set({
      a: new Element(),
      b: new Element(),
      c: new Element()
    })

    expect(measure.element.new.val.total).to.equal(4)
    expect(measure.element.parent.val.total).to.equal(3)
    expect(measure.element.parent.val.a).to.equal(1)
    expect(measure.element.parent.val.b).to.equal(1)
    expect(measure.element.parent.val.c).to.equal(1)
  })

  it('create new holder --> holder2', function () {
    holder2 = new holder.Constructor()
    expect(holder2).instanceof(holder.Constructor)
    expect(measure.element.new.val.total).to.equal(5)
    expect(measure.element.parent.val.total).to.equal(3)
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
      parent() {
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
    expect(measure.b).msg('b').equals(0)
    expect(measure.a).equals(1)
  })
})

describe('fires after set', function () {
  it('fires after nested set', function () {
    var a = new Observable({
      on: {
        parent() {
          expect(this.parent.parent.youzi).ok
        }
      }
    })
    var parent = new Observable({
      key: 'uberparent',
      youzi: {
        a: {
          useVal: a
        }
      }
    })
  })
})

describe('fires after set, properties', function () {
  it('fires after set', function () {
    var a = new Observable({
      on: {
        parent() {
          expect(this.parent.a.nerdje).ok
        }
      }
    })
    var parent = new Observable({
      key: 'uberparent',
      properties: {
        a: a
      },
      a: {
        nerdje: true
      }
    })
  })
})

describe('fires for multiple instances on same parent', function () {
  it('fires after set', function () {
    var keys = []
    var a = new Observable({
      on: {
        parent() {
          keys.push(this.key)
        }
      }
    })
    var b = new a.Constructor()
    var parent = new Observable({
      key: 'uberparent',
      a: {
        useVal: a
      },
      b: {
        useVal: b
      }
    })
    expect(keys.length).equals(2)
    expect(keys).contains('a')
    expect(keys).contains('b')
  })
})

describe('fires for multiple instances on different parents', function () {
  it('fires after set', function () {
    var keys = []
    var a = new Observable({
      on: {
        parent() {
          keys.push(this.key)
        }
      }
    })

    var b = new a.Constructor()
    var parent = new Observable({
      a: {
        useVal: a
      }
    })

    var anotherParent = new Observable({
      b: {
        useVal: b
      }
    })

    expect(keys.length).equals(2)
    expect(keys).contains('a')
    expect(keys).contains('b')
  })
})

describe('children with parent listeners', function () {
  var count = 0
  var measure = {}
  var Child = new Observable({
    on: {
      parent () {
        measure[count++] = this.key
      }
    }
  }).Constructor

  beforeEach(function () {
    count = 0
  })

  context('when children have no listeners', function(){
    before(function () {
      var parent = new Observable({
        one: {
          useVal: new Child()
        },
        two: {
          useVal: new Child()
        }
      })
    })

    it('should fire in the correct order when adding to parent', function () {
      expect(measure[0]).equals('one')
      expect(measure[1]).equals('two')
    })
  })

  context('when one child has data listener', function(){
    before(function () {
      var parent = new Observable({
        one: {
          useVal: new Child()
        },
        two: {
          useVal: new Child({
            on: {
              data () {}
            }
          })
        }
      })
    })

    it('should fire in the correct order when adding to parent', function () {
      expect(measure[0]).equals('one')
      expect(measure[1]).equals('two')
    })
  })

  context('when one child has new listener', function(){
    before(function () {
      var parent = new Observable({
        one: {
          useVal: new Child()
        },
        two: {
          useVal: new Child({
            on: {
              data () {}
            }
          })
        }
      })
    })

    it('should fire in the correct order when adding to parent', function () {
      expect(measure[0]).equals('one')
      expect(measure[1]).equals('two')
    })
  })
})
