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
          measure.a.property = meta
        }
      }
    })
  })

  it('property should not trigger events', function () {
    expect(a._on.property.triggerEvent).equals(false)
  })

  it('passes correct meta to change', function () {
    a.val = 'a'
    expect(measure.a.change).equals('a')
  })

  it('passes correct meta to property', function () {
    measure.afield = {}
    a.set({
      afield: {
        val: true,
        on: {
          change: function (event, meta) {
            measure.afield = meta
          }
        }
      }
    })
    expect(measure.a.property)
      .to.have.property('added')
      .which.has.property(0)
      .which.equals('afield')
  })

  it('change meta should be null when removed', function () {
    expect(measure.a.change).ok
    a.afield.remove()
    expect(measure.a.change).equals(void 0)
    expect(measure.afield).equals(null)
  })

  it('should have passed a removed array to property meta', function () {
    expect(measure.a.property)
      .to.have.property('removed')
      .which.has.property(0)
      .which.equals('afield')
  })
})
