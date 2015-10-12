var Observable = require('../../../../lib/observable')
Observable.prototype.inject(require('../../../../lib/operator/subscribe'))

describe('subscribe and bind', () => {
  it('subscribe it', () => {
    var child = new Observable({
      key: 'a',
      $subscribe: 'parent.title'
    })

    var parent = new Observable({
      title: 'myTitle',
      a: {
        useVal: child
      }
    })

    expect(parent)
    expect(child.val).equals('myTitle')
  })
})

describe('subscribe and bind, instance', () => {
  it('subscribe it', () => {
    var Child = new Observable({
      key: 'a',
      $subscribe: 'parent.title'
    }).Constructor

    var parent = new Observable({
      title: 'myTitle',
      a: {
        useVal: new Child()
      }
    })

    expect(parent)
    expect(parent.a.val).equals('myTitle')
  })
})

describe('subscribe and bind, instances', () => {
  it('subscribe it', () => {
    var Child = new Observable({
      key: 'a',
      $subscribe: 'nested.title'
    }).Constructor

    var son = new Child({
      nested: {
        title: 'Johnny'
      }
    })

    var daughter = new Child({
      nested: {
        title: 'Amy'
      }
    })

    expect(son.val).equals('Johnny')
    expect(daughter.val).equals('Amy')
  })
})

describe('subscribe and bind existing nested field', () => {
  it('subscribe it', () => {
    var child = new Observable({
      key: 'a',
      field: {
        nested: {
          title: 'myTitle'
        }
      },
      $subscribe: 'field.nested.title'
    })

    expect(child.val).equals('myTitle')
  })
})

describe('subscribe and bind non existent nested field', () => {
  it('subscribe it', () => {
    var child = new Observable({
      key: 'a',
      $subscribe: 'field.nested.title'
    })

    child.set({
      field: {
        nested: {
          title: 'myTitle'
        }
      }
    })

    expect(child.val).equals('myTitle')
  })
})

describe('subscribe and bind multiple levels', () => {
  it('subscribe it', () => {
    var child = new Observable({
      key: 'a',
      $subscribe: 'upward.title'
    })

    var parent = new Observable({
      a: {
        useVal: child
      }
    })

    var granny = new Observable({
      title: 'myTitle',
      p: {
        useVal: parent
      }
    })

    expect(parent && granny)
    expect(child.val).equals('myTitle')
  })
})

describe('subscribe and bind multiple levels, multiple steps', () => {
  it('subscribe it', () => {
    var child = new Observable({
      key: 'a',
      $subscribe: 'parent.title'
    })

    var parent = new Observable({
      key: 'parent',
      title: {
        $subscribe: 'parent.parent.title'
      },
      a: {
        useVal: child
      }
    })

    var granny = new Observable({
      title: 'myTitle',
      p: {
        useVal: parent
      }
    })

    expect(parent && granny)
    granny.title.val = 'updatedTitle'
    expect(child.val).equals('updatedTitle')
  })
})

describe('subscribe and bind multiple levels, multiple steps, references', () => {
  it('subscribe it', () => {
    var child = new Observable({
      key: 'a',
      $subscribe: 'parent.title'
    })

    var parent = new Observable({
      key: 'parent',
      title: {
        $subscribe: 'parent.parent.title'
      },
      a: {
        useVal: child
      }
    })

    var refTitle = new Observable()
    var refA = new Observable(refTitle)
    var refB = new Observable(refA)

    var granny = new Observable({
      title: refB,
      p: {
        useVal: parent
      }
    })

    expect(parent && granny)
    refTitle.val = 'updatedTitle'
    expect(child.val).equals('updatedTitle')
  })
})

describe('subscribe and bind, parent, instances', () => {
  it('subscribe it', () => {
    var child = new Observable({
      key: 'a',
      $subscribe: 'parent.title'
    })

    var mother = new Observable({
      key: 'mother',
      title: 'motherTitle',
      a: {
        useVal: new child.Constructor()
      }
    })

    var father = new Observable({
      key: 'father',
      title: 'fatherTitle',
      a: {
        useVal: new child.Constructor()
      }
    })

    expect(mother && father)
    expect(father.a.val).equals('fatherTitle')
    expect(mother.a.val).equals('motherTitle')
  })
})

describe('subscribe and bind, nested, instances, existing field', () => {
  it('subscribe it', () => {
    var Child = new Observable({
      key: 'a',
      nested: {
        title: 'nestedTitle'
      },
      $subscribe: 'nested.title'
    }).Constructor

    var mother = new Observable({
      key: 'mother',
      a: {
        useVal: new Child()
      }
    })

    var father = new Observable({
      key: 'father',
      a: {
        useVal: new Child()
      }
    })

    expect(mother && father)
    expect(father.a.val).equals('nestedTitle')
    expect(mother.a.val).equals('nestedTitle')
  })
})

describe('subscribe and bind, nested, instances, non existing field', () => {
  it('subscribe it', () => {
    var Child = new Observable({
      key: 'a',
      $subscribe: 'nested.title'
    }).Constructor

    var mother = new Observable({
      key: 'mother',
      a: {
        useVal: new Child({
          nested: {
            title: 'motherTitle'
          }
        })
      }
    })

    var father = new Observable({
      key: 'father',
      a: {
        useVal: new Child({
          nested: {
            title: 'fatherTitle'
          }
        })
      }
    })

    expect(mother && father)
    expect(father.a.val).equals('fatherTitle')
    expect(mother.a.val).equals('motherTitle')
  })
})
