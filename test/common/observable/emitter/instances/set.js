describe('set on instance nested field', function () {
  var Observable = require('../../../../../lib/observable')
  var cnt = 0
  var a = new Observable({
    key: 'a',
    trackInstances: true,
    b: {
      c: {
        on: {
          data: function () {
            cnt++
          }
        }
      }
    }
  })

  var aInstance

  it('listener fires once', function () {
    aInstance = new a.Constructor({
      key: 'aInstance'
    })
    expect(cnt).to.equal(0)
  })

  it('listener fired 2 times', function () {
    a.b.set({
      c: true
    })
    expect(cnt).to.equal(2)
  })

  it('listener fired 3 times', function () {
    aInstance.b.set({
      c: '?'
    })
    // we are now doing resolving of context!
    expect(cnt).to.equal(3)
  })
})
