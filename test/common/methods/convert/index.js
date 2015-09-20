var Base = require('../../../../lib/base/');

// require('../../../../lib/')
console.clear()

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
      x: {
        y: {
          $val: 123
        },
      },
    };

    expect(convertedObj).to.eql(expectedObject);
  });

  it('should output normal object', function() {
    var convertedObj = a.convert({
      plain: true
    });
    expect(convertedObj).to.be.an('object');
  });

  it('should convert function to string', function() {
    var convertedObj = a.convert({
      string: true
    });
    expect(convertedObj).to.be.an('string');

  })

  it('should exclude key/value', function() {
    var convertedObj = a.convert({
      exclude: function(val) {
        if (val === 'y') {
          return true
        }
      }
    })
    expect(convertedObj.x.y).to.be.undefined
  })

  //fnToString
  //exclude
  //plain

});
