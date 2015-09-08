var Base = require('../../../../lib/base/');

Base.prototype.inject(
  require('../../../../lib/methods/raw')
);

describe('raw', function() {
  var original = { x: { y: [{a: 123, b: '123'}, {c: 'abc', d: {e: true} }] } };
  var base;

  beforeEach(function() {
    base = new Base(original);
  });

  it('should convert and be the deep equal to expected object', function() {
    var raw = base.raw();

    expect(raw).to.eql(original);
  });

});