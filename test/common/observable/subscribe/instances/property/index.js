/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../../lib/observable')
var count
var instance

beforeEach(function () {
  count = 0
})

describe('subscribing to single existing field on original', function () {
  var a = new Observable({
    key: 'a',
    aField: 1
  })

  it('subcribes to field', function () {
    a.subscribe({
      aField: true
    }, function () {
      instance = this
      count++
    })
  })

  var b = new a.Constructor({
    key: 'b'
  })

  it('fires on instance', function () {
    b.set({aField: true})
    expect(count).equals(1)
    expect(instance.key).equals('b')
  })
})

describe('subscribing to parent on original', function () {
  var a = new Observable({
    key: 'a',
    b: {}
  })

  it('subcribes to field', function () {
    a.b.subscribe({
      parent: {
        parent: true
      }
    }, function () {
      instance = this
      count++
    })
  })

  it('fires on instance', function () {
    var b = new Observable({
      key: 'obsB',
      c: {
        specialUseValA: { useVal: a }
      }
    })
    expect(count).equals(1)
    expect(instance === b.c.specialUseValA.b).ok
  })
})

describe('subscribing to nested field on original', function () {
  var a = new Observable({
    key: 'a',
    aField: {
      bField: true
    }
  })

  it('subcribes to field', function () {
    a.subscribe({
      aField: {
        bField: true
      }
    }, function () {
      instance = this
      count++
    })
  })

  it('fires on instance', function () {
    var b = new a.Constructor({
      key: 'b'
    })

    b.set({
      aField: {
        bField: 1
      }
    })

    expect(count).equals(1)
    expect(instance.key).equals('b')
  })
})

describe('subscribing to single existing field on original', function () {
  var a = new Observable({
    key: 'aOrignator',
    aField: {
      bField: true
    }
  })

  it('subcribes to field', function () {
    a.subscribe({
      parent: {
        parent: {
          c: {
            ballz: true
          }
        }
      }
    }, function () {
      instance = this
      count++
    })
  })

  it('fires on instance', function () {
    var b = new Observable({
      key: 'b',
      trackInstances: true,
      c: {
        ballz: 1
      }
    })

    // why remove???
    // fires since addToNewParent
    b.set({
      d: {
        hahaFuckeriDo: {
          useVal: new a.Constructor()
        }
      }
    })

    expect(count).equals(1)
    expect(instance.key).equals('hahaFuckeriDo')
  })
})

describe('subscribing to single existing field on instance', function () {
  var a = new Observable({
    key: 'a',
    aField: {
      on: {
        data: {}
      }
    }
  })

  var b = new a.Constructor({
    key: 'b'
  })

  it('subscribes on fields', function () {
    b.subscribe({
      aField: true
    }, function () {
      instance = this
      count++
    })
  })

  it('fires once per set on instance', function () {
    a.set({
      aField: 2
    })

    expect(count).equals(1)
    expect(instance.key).equals('b')
  })
})

describe('subscribing to two existing fields on instance', function () {
  var a = new Observable({
    key: 'a',
    aField: {
      on: {
        data: {}
      }
    },
    anotherField: {
      on: {
        data: {}
      }
    }
  })

  var b = new a.Constructor({
    key: 'b'
  })

  it('subscribes on fields', function () {
    b.subscribe({
      aField: true,
      anotherField: true
    }, function () {
      instance = this
      count++
    })
  })

  it('fires once per set on instance', function () {
    a.set({
      aField: 2
    })

    a.set({
      anotherField: 2
    })

    expect(count).equals(2)
    expect(instance.key).equals('b')
  })
})

describe('subscribing to single non-existing field on instance', function () {
  var a = new Observable({
    on: {
      property: {}
    },
    key: 'a'
  })

  var b = new a.Constructor({
    key: 'b'
  })

  it('subscribes on fields', function () {
    b.subscribe({
      aField: true
    }, function () {
      instance = this
      count++
    })
  })

  it('fires once per set on instance', function () {
    a.set({
      aField: {
        val: 2,
        on: {
          data: {}
        }
      }
    })

    expect(count).equals(1)
    expect(instance.key).equals('b')
  })
})

describe('subscribing to single non-existing nested field on instance', function () {
  var a = new Observable({
    on: {
      property: {}
    },
    key: 'a'
  })

  var b = new a.Constructor({
    key: 'b'
  })

  it('subscribes on fields', function () {
    b.subscribe({
      aField: {
        nestedField: true
      }
    }, function () {
      instance = this
      count++
    })
  })

  it('fires once per set on instance', function () {
    a.set({
      aField: {
        nestedField: 1
      }
    })

    expect(count).equals(1)
    expect(instance.key).equals('b')
  })
})
