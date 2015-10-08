describe('unique', function () {
  var Observable = require('../../../../../lib/observable')
  var a, b, c
  it('create a new observables', function () {
    a = new Observable()
    b = new Observable()
    c = new Observable()
    expect(a.get('_on.data.base')).not.ok
  })

  it('attach reference, has storage object', function () {
    b.val = a
    expect(a.get('_on.data.base')).ok
    var cnt = 0
    a._on.data.base.each(function (property, key) {
      cnt++
      expect(property).eqls(b)
    })
    expect(cnt).eqls(1)
  })

  it('attach same reference, should not add an extra', function () {
    b.val = a
    var cnt = 0
    a._on.data.base.each(function (property, key) {
      cnt++
      expect(property).eqls(b)
    })
    expect(cnt).eqls(1)
  })
})
