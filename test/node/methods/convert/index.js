var Base = require('../../../../lib/base/');

// require('../../../../lib/')

Base.prototype.inject(
  require('../../../../lib/methods/convert')
);

describe('convert', function() {
  var a;

  beforeEach(function() {
    a = new Base({
      $key: 'a',
      x: {
        y: 123
      }
    });
  });

  it('should convert and be the deep equal to expected object', function() {
    var convertedObj = a.convert();
    var expectedObject = {
      $key: 'a',
      x: {
        $key: 'x',
        y: {
          $key: 'y',
          $val: 123
        },
      },
    };

    expect(convertedObj).to.eql(expectedObject);
  });

});
