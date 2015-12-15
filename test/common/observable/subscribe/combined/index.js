'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(() => {
  countOne = 0
  countTwo = 0
})

describe('multiple subs on same target, parent', () => {
  var subscriptionOne
  var subscriptionTwo
  var a = new Observable({
    title: 'foo',
    one: {},
    two: {}
  })

  it('subscribes to field', () => {
    subscriptionOne = a.one.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countOne++
    })
    subscriptionTwo = a.two.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countTwo++
    })
    expect(countOne).equals(0)
  })

  it('fires when updated', () => {
    a.title.val = 'bar'
    expect(countOne).equals(1)
    expect(countTwo).equals(1)
  })
})

describe('multiple subs on same target, $upward', () => {
  var subscriptionOne
  var subscriptionTwo
  var a = new Observable({
    title: 'foo',
    one: {},
    two: {}
  })

  it('subscribes to field', () => {
    subscriptionOne = a.one.subscribe({
      $upward: {
        title: true
      }
    }, function (data, event) {
      countOne++
    })
    subscriptionTwo = a.two.subscribe({
      $upward: {
        title: true
      }
    }, function (data, event) {
      countTwo++
    })
    expect(countOne).equals(0)
  })

  it('fires when updated', () => {
    a.title.val = 'bar'
    expect(countOne).equals(1)
    expect(countTwo).equals(1)
  })
})

describe('multiple subs on same target, non-existing parent', () => {
  var subscriptionOne
  var subscriptionTwo

  var one = new Observable()
  var two = new Observable()

  var parent = new Observable({
    title: 'Mary'
  })

  it('subscribes to field', () => {
    subscriptionOne = one.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countOne++
    })
    subscriptionTwo = two.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countTwo++
    })
    expect(countOne).equals(0)
    expect(countTwo).equals(0)
  })

  it('fires for one, when added to parent', () => {
    parent.set({
      child1: {
        useVal: one
      }
    })
    expect(countOne).equals(1)
  })

  it('fires for two, when added to parent', () => {
    parent.set({
      child2: {
        useVal: two
      }
    })
    expect(countTwo).equals(1)
  })

  it('fires when updated', () => {
    parent.title.val = 'Fred'
    expect(countOne).equals(1)
    expect(countTwo).equals(1)
  })
})

describe('multiple subs on same target, non-existing $upward', () => {
  var subscriptionOne
  var subscriptionTwo

  var one = new Observable()
  var two = new Observable()

  var parent = new Observable({
    title: 'Mary'
  })

  it('subscribes to field', () => {
    subscriptionOne = one.subscribe({
      $upward: {
        title: true
      }
    }, function (data, event) {
      countOne++
    })
    subscriptionTwo = two.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countTwo++
    })
    expect(countOne).equals(0)
    expect(countTwo).equals(0)
  })

  it('fires for one, when added to parent', () => {
    parent.set({
      child1: {
        useVal: one
      }
    })
    expect(countOne).equals(1)
  })

  it('fires for two, when added to parent', () => {
    parent.set({
      child2: {
        useVal: two
      }
    })
    expect(countTwo).equals(1)
  })

  it('fires when updated', () => {
    parent.title.val = 'Fred'
    expect(countOne).equals(1)
    expect(countTwo).equals(1)
  })
})

describe('multiple subs on same target, non-existing parent, instances', () => {
  var subscriptionOne
  var subscriptionTwo

  var one = new Observable()
  var two = new Observable()

  var parent = new Observable({
    title: 'Mary'
  })

  it('subscribes to field', () => {
    subscriptionOne = one.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countOne++
    })
    subscriptionTwo = two.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countTwo++
    })
    expect(countOne).equals(0)
    expect(countTwo).equals(0)
  })

  it('fires for one, when added to parent', () => {
    parent.set({
      child1: {
        useVal: new one.Constructor()
      }
    })
    expect(countOne).equals(1)
  })

  it('fires for two, when added to parent', () => {
    parent.set({
      child2: {
        useVal: new two.Constructor()
      }
    })
    expect(countTwo).equals(1)
  })

  it('fires when updated', () => {
    parent.title.val = 'Fred'
    expect(countOne).equals(1)
    expect(countTwo).equals(1)
  })
})

describe('multiple subs on same target, $upward, instance', () => {
  var subscriptionOne
  var subscriptionTwo
  var parent = new Observable()
  var a = new Observable({
    one: {},
    two: {}
  })

  it('subscribes to field', () => {
    subscriptionOne = a.one.subscribe({
      $upward: {
        title: true
      }
    }, function (data, event) {
      countOne++
    })

    subscriptionTwo = a.two.subscribe({
      $upward: {
        title: true
      }
    }, function (data, event) {
      countTwo++
    })

    expect(countOne).equals(0)
  })

  it('fires when updated', () => {
    parent.set({
      title: 'fonz',
      child: {
        useVal: new a.Constructor()
      }
    })
    expect(countOne).equals(1)
    expect(countTwo).equals(1)
  })
})

describe('removing reference listeners after reference switch', () => {
  var ref1 = new Observable({
    title: 'refOne'
  })
  var ref2 = new Observable({
    title: 'refOne'
  })
  var a = new Observable(ref1)

  it('subscribes to field', () => {
    a.subscribe({
      title: true
    }, function (data, event) {
      countOne++
    })
    expect(countOne).equals(0)
  })

  it('fires when ref1 is updated', function () {
    ref1.title.val = 'smur'
    expect(countOne).equals(1)
  })

  it('ref1 has listeners', function () {
    expect(testListeners(ref1.title).length).equals(1)
  })

  it('switch to ref2 => ref2 has listeners', function () {
    a.set(ref2)
    expect(testListeners(ref2.title).length).equals(1)
  })

  it('removed ref1 listeners', function () {
    expect(testListeners(ref1.title).length).equals(0)
  })
})

describe('instances', function () {
  var counter = {
    a: 0,
    b: 0,
    c: 0
  }
  var a = new Observable({
    key: 'a',
    nested: {
      title: 'aNestedTitle'
    },
    title: 'aTitle'
  })
  var b
  var c

  it('subscribes to field', function () {
    a.subscribe({
      title: true,
      nested: {
        title: true
      },
      bField: true,
      cField: true
    }, function (data, event) {
      counter[this.key]++
    })

    expect(counter.a).equals(0)
  })

  it('make some instances', function () {
    b = new a.Constructor({
      key: 'b'
    })
    c = new b.Constructor({
      key: 'c'
    })
    expect(counter.a).equals(0)
    expect(counter.b).equals(0)
    expect(counter.c).equals(0)
  })

  it('change on original, fires for all instances', function () {
    a.set({
      title: 'niceTitle'
    })
    expect(counter.a).equals(1)
    expect(counter.b).equals(1)
    expect(counter.c).equals(1)
  })

  it('change on instance, fires for all his instances', function () {
    b.set({
      bField: 'niceField'
    })
    expect(counter.a).equals(1)
    expect(counter.b).equals(2)
    expect(counter.c).equals(2)
  })

  it('setting same on original, only fires for original', function () {
    a.set({
      bField: 'aNiceField'
    })
    expect(counter.a).equals(2)
    expect(counter.b).equals(2)
    expect(counter.c).equals(2)
  })

  it('setting same on instance, only fires for instance', function () {
    c.set({
      bField: 'cNiceField'
    })
    expect(counter.a).equals(2)
    expect(counter.b).equals(2)
    expect(counter.c).equals(3)
  })

  it('removing on instance, only fires for instance', function () {
    b.bField.remove()
    expect(counter.a).equals(2)
    expect(counter.b).equals(3)
    expect(counter.c).equals(3)
  })

  xit('removing on other instance, only fires for instance', function () {
    c.bField.remove()
    expect(counter.a).equals(2)
    expect(counter.b).equals(3)
    expect(counter.c).equals(4)
  })
})

describe('instances, subscribe through reference', function () {
  var counter = {
    a: 0,
    b: 0,
    c: 0
  }
  var ref = new Observable({
    key: 'ref',
    nested: {
      title: 'aNestedTitle'
    },
    title: 'aTitle'
  })
  var a = new Observable({
    key: 'a',
    val: ref
  })
  var b
  var c

  it('subscribes to field', function () {
    a.subscribe({
      title: true,
      nested: {
        title: true
      },
      bField: true,
      cField: true
    }, function (data, event) {
      counter[this.key]++
    })

    expect(counter.a).equals(0)
  })

  it('make some instances', function () {
    b = new a.Constructor({
      key: 'b'
    })
    c = new b.Constructor({
      key: 'c'
    })
    expect(counter.a).equals(0)
    expect(counter.b).equals(0)
    expect(counter.c).equals(0)
  })

  it('change on original, fires for all instances', function () {
    ref.set({
      title: 'niceTitle'
    })
    expect(counter.a).equals(1)
    expect(counter.b).equals(1)
    expect(counter.c).equals(1)
  })

  it('change on instance, fires for all his instances', function () {
    b.set({
      bField: 'niceField'
    })
    expect(counter.a).equals(1)
    expect(counter.b).equals(2)
    expect(counter.c).equals(2)
  })

  it('setting same on original, only fires for original', function () {
    a.set({
      bField: 'aNiceField'
    })
    expect(counter.a).equals(2)
    expect(counter.b).equals(2)
    expect(counter.c).equals(2)
  })

  it('setting same on instance, only fires for instance', function () {
    c.set({
      bField: 'cNiceField'
    })
    expect(counter.a).equals(2)
    expect(counter.b).equals(2)
    expect(counter.c).equals(3)
  })

  it('removing on instance, only fires for instance', function () {
    b.bField.remove()
    expect(counter.a).equals(2)
    expect(counter.b).equals(3)
    expect(counter.c).equals(3)
  })

  xit('removing on other instance, only fires for instance', function () {
    c.bField.remove()
    expect(counter.a).equals(2)
    expect(counter.b).equals(3)
    expect(counter.c).equals(4)
  })
})

describe('instances, subscribe through reference, nested', function () {
  var counter = {
    a: 0,
    b: 0,
    c: 0
  }

  var ref = new Observable({
    key: 'ref',
    nested: {
      title: 'aNestedTitle'
    },
    title: 'aTitle'
  })

  var a = new Observable({
    key: 'a',
    nest: {
      val: ref
    }
  })

  var b
  var c

  it('subscribes to field', function () {
    a.subscribe({
      nest: {
        title: true,
        nested: {
          title: true
        },
        bField: true,
        cField: true
      }
    }, function (data, event) {
      counter[this.key]++
    })

    expect(counter.a).equals(0)
  })

  it('make some instances', function () {
    b = new a.Constructor({
      key: 'b'
    })
    c = new b.Constructor({
      key: 'c'
    })
    expect(counter.a).equals(0)
    expect(counter.b).equals(0)
    expect(counter.c).equals(0)
  })

  it('change on original, fires for all instances', function () {
    ref.set({
      title: 'niceTitle'
    })
    expect(counter.a).equals(1)
    expect(counter.b).equals(1)
    expect(counter.c).equals(1)
  })

  it('change on instance, fires for all his instances', function () {
    b.set({
      nest: {
        bField: 'niceField'
      }
    })

    expect(counter.a).equals(1)
    expect(counter.b).equals(2)
    expect(counter.c).equals(2)
  })

  it('setting same on original, only fires for original', function () {
    a.set({
      nest: {
        bField: 'aNiceField'
      }
    })
    expect(counter.a).equals(2)
    expect(counter.b).equals(2)
    expect(counter.c).equals(2)
  })

  it('setting same on instance, only fires for instance', function () {
    c.set({
      nest: {
        bField: 'cNiceField'
      }
    })
    expect(counter.a).equals(2)
    expect(counter.b).equals(2)
    expect(counter.c).equals(3)
  })

  it('removing on instance, only fires for instance', function () {
    b.nest.bField.remove()
    expect(counter.a).equals(2)
    expect(counter.b).equals(3)
    expect(counter.c).equals(3)
  })

  it('removing on other instance, only fires for instance', function () {
    c.nest.bField.remove()
    expect(counter.a).equals(2)
    expect(counter.b).equals(3)
    expect(counter.c).equals(4)
  })
})

describe('adding on multiple instances', function () {
  var count = {
    one: 0,
    two: 0
  }
  var subber = new Observable()
  subber.subscribe({
    parent: {
      content: true
    }
  }, function (data, event) {
    count[this.key]++
  })
  var Subber = subber.Constructor
  var obs = new Observable({
    properties: {
      content: new Observable().Constructor
    },
    one: {
      useVal: new Subber()
    },
    two: {
      useVal: new Subber()
    }
  })

  it('adding fires both instances', function () {
    obs.set({
      content: 'addingIt'
    })
    expect(count.one).equals(1)
    expect(count.two).equals(1)
  })
})

describe('removing and adding on multiple instances', function () {
  var count = {
    one: 0,
    two: 0
  }
  var subber = new Observable()
  subber.subscribe({
    parent: {
      content: true
    }
  }, function (data, event) {
    count[this.key]++
  })
  var Subber = subber.Constructor
  var obs = new Observable({
    key: 'obs',
    content: 'test',
    one: {
      useVal: new Subber()
    },
    two: {
      useVal: new Subber()
    }
  })

  it('fired once for each instance', function () {
    expect(count.one).equals(1)
    expect(count.two).equals(1)
  })

  it('removing fires both instances', function () {
    obs.content.remove()
    expect(count.one).equals(2)
    expect(count.two).equals(2)
  })

  it('adding fires both instances', function () {
    obs.set({
      content: 'addedAgain'
    })
    expect(count.one).equals(3)
    expect(count.two).equals(3)
  })
})

describe('removing and adding on multiple instances, nested field', function () {
  var count = {
    one: 0,
    two: 0
  }
  var subber = new Observable({
    thing: {}
  })
  subber.thing.subscribe({
    $upward: {
      content: true
    }
  }, function (data, event) {
    count[this.parent.key]++
  })
  var Subber = subber.Constructor
  var obs = new Observable({
    key: 'obs',
    content: 'test',
    one: {
      useVal: new Subber()
    },
    two: {
      useVal: new Subber()
    }
  })

  it('fired once for each instance', function () {
    expect(count.one).equals(1)
    expect(count.two).equals(1)
  })

  it('removing fires both instances', function () {
    obs.content.remove()
    expect(count.one).equals(2)
    expect(count.two).equals(2)
  })

  it('adding fires both instances', function () {
    obs.set({
      content: 'addedAgain'
    })
    expect(count.one).equals(3)
    expect(count.two).equals(3)
  })
})

describe('removing and adding on multiple instances, nested field', function () {
  var count = {
    one: 0,
    two: 0
  }
  var subber = new Observable({
    key: 'subber',
    foo: {}
  })
  subber.foo.subscribe({
    $upward: {
      content: true
    }
  }, function (data, event) {
    count[this.parent.key]++
  })
  var Subber = subber.Constructor
  var Two = new Observable({
    key: 'holderTwo',
    two: {
      useVal: new Subber()
    }
  }).Constructor

  var obs = new Observable({
    key: 'obs',
    content: 'test',
    one: {
      useVal: new Subber()
    },
    thing: {
      useVal: new Two()
    }
  })

  it('fired once for each instance', function () {
    expect(count.one).equals(1)
    expect(count.two).equals(1)
  })

  it('removing fires both instances', function () {
    obs.content.remove()
    expect(count.one).equals(2)
    expect(count.two).equals(2)
  })

  it('adding fires both instances', function () {
    obs.set({
      content: 'addedAgain'
    })
    expect(count.one).equals(3)
    expect(count.two).equals(3)
  })
})

describe('multiple subs render case', function () {
  var renderCnt = 0
  var scrollCnt = 0

  var obs = new Observable({
    rendered: true,
    scrollTop: 1,
    child: {
      prop: {}
    }
  })

  obs.child.subscribe({
    $upward: {
      rendered: true
    }
  }, function () {
    renderCnt++
  })

  obs.child.prop.subscribe({
    $upward: {
      scrollTop: true
    }
  }, function () {
    scrollCnt++
  })

  it('should not have fired the listeners', function () {
    expect(renderCnt).equals(0)
    expect(scrollCnt).equals(0)
  })

  it('updating scroll doesn\'t fire render', function () {
    obs.scrollTop.val = 2
    expect(renderCnt).equals(0)
    expect(scrollCnt).equals(1)
  })

  it('updating scroll many times doesn\'t fire render', function () {
    var ten = 10
    while (ten) {
      obs.scrollTop.val = ten--
    }
    expect(renderCnt).equals(0)
    expect(scrollCnt).equals(11)
  })
})

describe('multiple subs from same subscriber fires own listeners', function () {
  var obs = new Observable({
    child1: 1,
    child2: 1
  })

  obs.subscribe({
    child1: true
  }, function () {
    countOne++
  })

  obs.subscribe({
    child2: true
  }, function () {
    countTwo++
  })

  it('updating child1, only fires own listener', function () {
    obs.child1.val = 2
    expect(countOne).equals(1)
    expect(countTwo).equals(0)
  })
})