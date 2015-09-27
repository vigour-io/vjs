describe('meta', function () {
  var Observable = require('../../../../../../lib/observable')
  var a
  var measure = {}

  it('creates an observable, adds emitter types', function () {
    measure.a = {}
    a = new Observable({
      key: 'a',
      on: {
        change: function (event, meta) {
          measure.a.change = meta
        },
        property: function (event, meta) {
          console.error('fire prop!', meta)
          measure.a.property = meta
        }
      }
    })
  })

  it('property should not trigger events', function () {
    expect(a._on.property.triggerEvent).equals(false)
  })

  xit('passes correct meta to change', function () {
    a.val = 'a'
    expect(measure.a.change).equals('a')
  })

  it('passes correct meta to property', function () {
    a.set({ afield: true })
    console.log(measure.a.property)
    // expect(measure.a.property).equals('a')
  })

  it('change meta should be null when removed', function () {
    console.warn('-------')
    a.afield.remove()
    expect(measure.a.change).equals(null)
  })
})
