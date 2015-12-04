describe('nested data listener on class fires on instance', function () {
  var cnt = 0
  var Observable = require('../../../../../lib/observable')
  var a = new Observable({
    key: 'a',
    trackInstances: true,
    nested: {
      on: {
        data () {
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
    console.clear()
    cnt = 0
    a.nested.set({
      c: true
    })
    expect(cnt).to.equal(2)
  })
})
