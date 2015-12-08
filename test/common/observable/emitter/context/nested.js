describe('nested data listener on class fires on instance', function () {
  var cnt = 0
  var Observable = require('../../../../../lib/observable')
  var a = new Observable({
    key: 'a',
    trackInstances: true,
    nested: {
      on: {
        data (data) {
          cnt++
        }
      }
    }
  })

  var aInstance = new a.Constructor({ // eslint-disable-line
    key: 'aInstance'
  })

  it('listener fires on both class and instance when updating class, val update', function () {
    cnt = 0
    a.nested.set({
      val: true
    })
    expect(cnt).to.equal(2)
  })

  it('listener fires on both class and instance when updating class, property set', function () {
    cnt = 0
    a.nested.set({
      c: true
    })
    expect(cnt).to.equal(2)
  })
})

describe('nested property listener on class fires on instance', function () {
  var cnt = 0
  var Observable = require('../../../../../lib/observable')
  var paths = {}
  var a = new Observable({
    key: 'a',
    trackInstances: true,
    nested: {
      on: {
        property (data) {
          var added = data.added
          var propertyKey = added[0]
          paths[this.parent.key] = this[propertyKey].path
          cnt++
        }
      }
    }
  })

  var aInstance = new a.Constructor({ // eslint-disable-line
    key: 'aInstance'
  })

  it('listener fires on both class and instance when updating class, property set', function () {
    a.nested.set({
      c: true
    })
    expect(paths.a).deep.equals(['a', 'nested', 'c'])
    expect(paths.aInstance).deep.equals(['aInstance', 'nested', 'c'])
  })

  it('context set a.nested.d', function () {
    a.nested.set({
      d: true
    })
    aInstance.nested.d.val = 'bla'
    expect(aInstance.nested.d).to.not.equal(a.nested.d)
  })
})
