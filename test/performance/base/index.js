var Base = require('../../../lib/base')

describe( 'base context performance', function() {
  this.timeout(50e3);
  var a;

  beforeEach(function() {
    a = new Base({
      $key: 'a',
      x: {
        y: {
          z: {
            w: {
              rahh: -1
            }
          }
        }
      }
    });
  });

  it( 'resolve context set performance', function( done ) {
    this.timeout(50e3)

    var amount = 1e5

    expect(function() {
      for(var i = 0 ; i < amount; i++) {
        var b = new a.$Constructor()
        b.x.y.z.w.rahh.$resolveContextSet(i + 1) //2.6 new vs. 3.6 old
      }
    }).performance({
      margin: 6,
      // loop:10,
      method: function() {
        for(var i = 0 ; i < amount; i++) {
          var b = new a.$Constructor()
          a.x.y.z.w.rahh.set(i + 1) //2.6 new vs. 3.6 old
        }
      }
    }, done)
  });

});
