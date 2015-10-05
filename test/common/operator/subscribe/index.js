var Observable = require('../../../../lib/observable')
Observable.prototype.inject(require('../../../../lib/operator/subscribe'))

describe('subscribe and bind', function () {
  it('subscribe it', function () {
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

describe('subscribe and bind, instance', function () {
  it('subscribe it', function () {
    var child = new Observable({
      key: 'a',
      $subscribe: 'parent.title'
    })

    var parent = new Observable({
      title: 'myTitle',
      a: {
        useVal: new child.Constructor()
      }
    })

    expect(parent)
    expect(parent.a.val).equals('myTitle')
  })
})

describe('subscribe and bind nested field', function () {
  it('subscribe it', function () {
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
