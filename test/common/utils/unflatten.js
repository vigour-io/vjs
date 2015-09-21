var unflatten = require('../../../lib/util/unflatten')

var expected = {
  a: {
    b: {
      c: 'Shwisha',
      d: 'Full',
      e: 'Of'
    },
    c: 'Dat'
  },
  b: 1
}

describe('unflatten', function () {
  var original = {'a.b.c': 'Shwisha', 'a.b.d': 'Full', 'a.b.e': 'Of', 'a.c': 'Dat', 'b': 1}
  it('should unflatten', function () {
    var unflattened = unflatten(original)
    expect(unflattened).to.deep.equal(expected)
  })

  it('should flatten accept an optional separator argument', function () {
    var original = {'a/b/c': 'Shwisha', 'a/b/d': 'Full', 'a/b/e': 'Of', 'a/c': 'Dat', 'b': 1}
    var unflattened = unflatten(original, '/')
    expect(unflattened).to.deep.equal(expected)
  })
})
