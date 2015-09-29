describe('data-argument', function () {
  var Observable = require('../../../../../../lib/observable')
  var a
  var measure = {}

  it('creates an observable, adds emitter types', function () {
    measure.a = {}
    a = new Observable({
      key: 'a',
      on: {
        data: function (data) {
          measure.a.data = data
        },
        property: function (data) {
          measure.a.property = data
        }
      }
    })
  })

  it('property should not trigger events', function () {
    expect(a._on.property.triggerEvent).equals(false)
  })

  it('passes correct data to change', function () {
    a.val = 'a'
    expect(measure.a.data).equals('a')
  })

  it('passes correct data to property', function () {
    measure.afield = {}
    a.set({
      afield: {
        val: true,
        on: {
          data: function (data) {
            measure.afield = data
          }
        }
      }
    })
    expect(measure.a.property)
      .to.have.property('added')
      .which.has.property(0)
      .which.equals('afield')
  })

  it('change data should be null when removed', function () {
    expect(measure.a.data).ok
    a.afield.remove()
    expect(measure.afield).equals(null)
    expect(measure.a.data).equals(void 0)
  })

  it('should have passed a removed array to property data', function () {
    expect(measure.a.property)
      .to.have.property('removed')
      .which.has.property(0)
      .which.equals('afield')
  })
})
