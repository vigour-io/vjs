describe('object ', function () {
  var Observable = require('../../../../lib/observable')
  var a

  it('create a new observable, use objects, test add', function () {
    console.clear()
    a = new Observable({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      b: 'its b',
      // merge er ook bij
      $add: function () {
        return { c: 'its c' }
      }
    })
    //easy ways to maniupulate cache objects
    expect(a.val).equals(a._cache)
    expect(a.val.b._input).equals(a.b)
    expect(a.val).to.have.property('c').which.has.property('_input').which.equals('its c')

    console.log(a.val)
  })
})
