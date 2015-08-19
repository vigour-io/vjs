var Base = require('../../../lib/base')

Base.prototype.inject(
  require('../../../lib/methods/each')
)

describe('methods', function() {

  it('each', function( done ) {
    this.timeout(50e3)

    var amount = 1e5

    var a = new Base({
      $key: 'a',
      x: {
        $val: 456
      },
      y: {
        $val: 123
      },
      z: {
        $val: 987
      },
      w: {
        $val: 101
      }
    })

    var count = 0;
    var fn = function(item) { count++; };

    expect(function() {
      for(var i = 0 ; i < amount; i++) {
        a.each(fn)
      }
    }).performance({
      margin: 3,
      loop: 5,
      method: function() {
        count = 0;

        for(var i = 0 ; i < amount; i++) {
          for (var key in a) {
            fn(a[key])
          }
        }
      }
    }, done)
  });

});
