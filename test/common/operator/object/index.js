describe('object ', function () {
  var Observable = require('../../../../lib/observable')

  describe('add', function () {
    var a
    it('create a new observable, should return a cache object', function () {
      a = new Observable({
        inject: require('../../../../lib/operator/all'),
        key: 'a',
        b: 'its b',
        // merge er ook bij
        $add: function () {
          return { c: 'its c' }
        }
      })
      expect(a.val).equals(a._cache)
    })

    it('should have field a.b', function () {
      expect(a.val.b._input).equals(a.b)
    })

    it('should have field a.b.c', function () {
      expect(a.val).has.property('c')
        .which.has.property('_input')
        .which.equals('its c')
    })
  })

  it('create a new observable, use objects, test transform', function () {
    var a

    a = new Observable({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      b: 'its b',
      // merge er ook bij
      $add: function () {
        return { c: 'its c' }
      }
    })
    expect(a.val).equals(a._cache)
    expect(a.val.b._input).equals(a.b)
    expect(a.val).to.have.property('c').which.has.property('_input').which.equals('its c')
  })
})
