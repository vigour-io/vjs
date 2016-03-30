var Observable = require('../../../../lib/observable')
Observable.prototype.inject(require('../../../../lib/operator/subscribe'))

describe('subscribe', () => {
  describe('bind', () => {
    it('subscribe it', () => {
      var child = new Observable({
        key: 'a',
        $: 'parent.title'
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

  describe('bind object', () => {
    it('subscribe it', () => {
      var child = new Observable({
        key: 'a',
        $: 'parent.info'
      })

      var parent = new Observable({
        info: {
          title:'myTitle',
          subtitle:'mySubstitle'
        },
        a: {
          useVal: child
        }
      })

      expect(parent)
      expect(child.val.title.val).equals('myTitle')
    })
  })

  describe('bind instance', () => {
    it('subscribe it', () => {
      var Child = new Observable({
        key: 'a',
        $: 'parent.title'
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

  describe('bind object, instance', () => {
    it('subscribe it', () => {
      var Child = new Observable({
        key: 'a',
        $: 'parent.info'
      }).Constructor

      var parent = new Observable({
        info: {
          title:'myTitle',
          subtitle:'mySubstitle'
        },
        a: {
          useVal: new Child()
        }
      })

      expect(parent)
      expect(parent.a.val.title.val).equals('myTitle')
    })
  })

  describe('bind instances', () => {
    it('subscribe it', () => {
      var Child = new Observable({
        trackInstances: true,
        key: 'a',
        $: './nested.title'
      }).Constructor
      var son = new Child({
        key:'son',
        nested: {
          title: 'Johnny'
        }
      })
      var daughter = new Child({
        key:'daughter',
        nested: {
          title: 'Amy'
        }
      })
      expect(son.val).equals('Johnny')
      expect(daughter.val).equals('Amy')
    })
  })

  describe('bind existing nested field', () => {
    it('subscribe it', () => {
      var child = new Observable({
        key: 'a',
        field: {
          nested: {
            title: 'myTitle'
          }
        },
        $: 'field.nested.title'
      })

      expect(child.val).equals('myTitle')
    })
  })

  describe('bind non existent nested field', () => {
    it('subscribe it', () => {
      var child = new Observable({
        key: 'a',
        $: 'field.nested.title'
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

  describe('bind multiple levels', () => {
    it('subscribe it', () => {
      var child = new Observable({
        key: 'a',
        $: 'upward.title'
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

  describe('bind multiple levels, multiple steps', () => {
    it('subscribe it', () => {
      var child = new Observable({
        key: 'a',
        $: 'parent.title'
      })

      var parent = new Observable({
        key: 'parent',
        title: {
          $: 'parent.parent.title'
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

  describe('bind multiple levels, multiple steps, references', () => {
    it('subscribe it', () => {
      var child = new Observable({
        key: 'a',
        $: 'parent.title'
      })

      var parent = new Observable({
        key: 'parent',
        title: {
          $: 'parent.parent.title'
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

  describe('bind, parent, instances', () => {
    it('subscribe it', () => {
      var child = new Observable({
        key: 'a',
        $: 'parent.title'
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

  describe('bind, nested, instances, existing field', () => {
    it('subscribe it', () => {
      var Child = new Observable({
        key: 'a',
        nested: {
          title: 'nestedTitle'
        },
        $: 'nested.title'
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

  describe('bind, nested, instances, non existing field', () => {
    it('subscribe it', () => {
      var Child = new Observable({
        key: 'a',
        $: 'nested.title'
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
})
