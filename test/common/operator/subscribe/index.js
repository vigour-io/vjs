'use strict'
var Observable = require('../../../../lib/observable')
Observable.prototype.inject(require('../../../../lib/operator/subscribe'))

describe('subscribe', function () {
  describe('subscribing on parent title', function () {
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

    it('child value is parent title', function () {
      expect(parent)
      expect(child.val).equals('myTitle')
    })

    it('updating parent title, changes child value', function () {
      parent.title.val = 'newTitle'
      expect(child.val).equals('newTitle')
    })

    it('removing parent title updates child value', function () {
      parent.title.remove()
      expect(child.val).not.equals('newTitle')
    })

    it('adding new parent title updates child value', function () {
      parent.set({
        title: 'addedTitle'
      })
      expect(child.val).equals('addedTitle')
    })
  })

  describe('bind object', function () {
    it('subscribe it', function () {
      var child = new Observable({
        key: 'a',
        $: 'parent.info'
      })

      var parent = new Observable({
        info: {
          title: 'myTitle',
          subtitle: 'mySubstitle'
        },
        a: {
          useVal: child
        }
      })

      expect(parent)
      expect(child.val.title.val).equals('myTitle')
    })
  })

  describe('bind instance', function () {
    it('subscribe it', function () {
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

  describe('bind object, instance', function () {
    it('subscribe it', function () {
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

  describe('bind instances', function () {
    it('subscribe it', function () {
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

  describe('bind existing nested field', function () {
    it('subscribe it', function () {
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

  describe('bind non existent nested field', function () {
    it('subscribe it', function () {
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

  describe('bind multiple levels', function () {
    it('subscribe it', function () {
      var child = new Observable({
        key: 'a',
        $: '$upward.title'
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

  describe('bind multiple levels, multiple steps', function () {
    it('subscribe it', function () {
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

  describe('bind multiple levels, multiple steps, references', function () {
    it('subscribing over multiple references', function () {
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

  describe('bind, parent, instances', function () {
    it('subscribe it', function () {
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

  describe('bind, nested, instances, existing field', function () {
    it('subscribe it', function () {
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

  describe('bind, nested, instances, non existing field', function () {
    it('subscribe it', function () {
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

  describe('subscribe on own value', function () {
    xit('subscribing on self is subscribing on input', function () {
      var ref = new Observable('ref')
      var obs = new Observable({
        val: ref,
        $: true
      })

      expect(obs.$origin._input).equals(obs._input)
    })
  })
})
