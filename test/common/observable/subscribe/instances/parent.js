'use strict'
/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count
var instance

beforeEach(() => {
  count = 0
})

describe('subscribing to same parent with multiple instances', function () {
  var keys = []
  var a = new Observable({
    key: 'a'
  })
  var b
  it('subcribes to field', function () {
    a.subscribe({
      parent: {
        field: true
      }
    }, function () {
      keys.push(this.key)
      count++
    })

    b = new a.Constructor({
      key: 'b'
    })
    expect(count).equals(0)
  })

  it('fires on instance', function () {
    new Observable({
      field: 1,
      a: {
        useVal: a
      },
      b: {
        useVal: b
      }
    })
    expect(count).equals(2)
    expect(keys).contains('a')
    expect(keys).contains('b')
  })
})

describe('subscribing to same parent with more instances', function () {
  var keys = []

  var a = new Observable({
    trackInstances: true,
    key: 'a'
  })

  it('subcribes to field', function () {
    a.subscribe({
      parent: {
        field: true
      }
    }, function () {
      keys.push(this.key)
      count++
    })
  })

  var b = new a.Constructor({
    key: 'b'
  })

  var c = new b.Constructor({
    key: 'c'
  })

  var d = new c.Constructor({
    key: 'd'
  })

  it('fires on instance', function () {
    new Observable({
      field: 1,
      a: {
        useVal: a
      },
      b: {
        useVal: b
      },
      c: {
        useVal: c
      },
      d: {
        useVal: d
      }
    })
    expect(count).equals(4)
    expect(keys).contains('a')
    expect(keys).contains('b')
    expect(keys).contains('c')
    expect(keys).contains('d')
  })
})

describe('subscribing to different parent with several instances', function () {
  var obj = {}
  var one
  var two
  var a = new Observable({
    trackInstances: true
  })

  it('subcribes to field', function () {
    a.subscribe({
      parent: {
        field: true
      }
    }, function (data) {
      obj[this.key] = data[0].origin.val
      count++
    })
  })

  it('add a to parent one', function () {
    one = new Observable({
      key:'one',
      field: 1,
      a: {
        useVal: new a.Constructor({
          key: 'a'
        })
      }
    })
    expect(obj.a).equals(1)
  })

  it('add b to parent two', function () {
    two = new Observable({
      key:'two',
      field: 2,
      b: {
        useVal: new a.Constructor({
          key: 'b'
        })
      }
    })
    expect(obj.b).equals(2)
  })

  it('change one.field', function () {
    one.field.val = 3
    expect(obj.b).equals(2)
    expect(obj.a).equals(3)
  })

  // it('change two.field', function () {
  //   two.field.val = 4
  //   expect(obj.b).equals(4)
  //   expect(obj.a).equals(3)
  // })

  // it('add another instance to parent two', function () {
  //   two.set({
  //     c:{
  //       useVal:new a.Constructor({
  //         key:'c'
  //       })
  //     }
  //   })
  //   expect(obj.c).equals(4)
  // })

  // it('change two.field', function () {
  //   two.field.val = 5
  //   expect(obj.c).equals(5)
  //   expect(obj.b).equals(5)
  //   expect(obj.a).equals(3)
  // })

  //   new Observable({
  //     key:'two',
  //     field: 2,
  //     a: {
  //       useVal: b
  //     }
  //   })
  //   new Observable({
  //     key:'three',
  //     field: 3,
  //     a: {
  //       useVal: c
  //     }
  //   })
  //   new Observable({
  //     key:'four',
  //     field: 4,
  //     a: {
  //       useVal: d
  //     }
  //   })
  //   expect(count).equals(4)
  //   expect(keys).contains('a')
  //   expect(keys).contains('b')
  //   expect(keys).contains('c')
  //   expect(keys).contains('d')
  // })
})
