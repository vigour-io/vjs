var Base = require('../../../../lib/base/')
var Keys = require('../../../../lib/methods/keys')

Base.prototype.inject(Keys)

describe('keys', function() {
  var a

  beforeEach(function() {
    a = new Base({
      x: {
        y: 123
      },
      z: 456
    })
  })

  it('should return object keys', function() {
    var results = a.keys();
    expect(results).to.eql(['x', 'z'])
  })

});
