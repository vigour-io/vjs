describe('nested data listener on class fires on instance', function () {
  var cnt = 0
  var Observable = require('../../../../../lib/observable')

  it('listener fires on both class and instance when updating class, val update', function () {
    cnt = 0
    var b = new Observable()

    var a = new Observable({
      key: 'a',
      trackInstances: true,
      nested: {
        on: {
          data: [function (data) {
            cnt++
          }, b]
        }
      }
    })

    var aInstance = new a.Constructor({ // eslint-disable-line
      key: 'aInstance'
    })
    b.on('data', [function () {}, a.nested._on.data])

    aInstance.nested.on('data', [
      function () {
        // console.log('xxxx'.red)
      }
    ])

    var c = new Observable({ //eslint-disable-line
      on: {
        data: [function () {}, aInstance.nested._on.data]
      }
    })

    aInstance.remove()

    expect(a.nested._on.data.listensOnAttach).to.not.have.property(2)
    expect(a.nested._on.data.listensOnAttach).to.have.property(1)
  })
})
