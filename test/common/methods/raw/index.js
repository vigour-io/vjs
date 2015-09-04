var Base = require('../../../../lib/base/');

Base.prototype.inject(
  require('../../../../lib/methods/raw')
);

describe('raw', function() {
  var original = { x: { y: 123 } };
  var base;

  beforeEach(function() {
    base = new Base({
      x: {
        y: 123
      }
    });
  });

  it('should convert and be the deep equal to expected object', function() {
    var raw = base.raw();

    expect(raw).to.eql(original);
  });

});