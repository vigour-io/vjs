var Base = require('../../../../lib/base/')
var ToString = require('../../../../lib/methods/toString')

Base.prototype.inject(ToString)

describe('toString', function() {
  var a

  beforeEach(function() {
    a = new Base({
      $key: 'a',
      x: {
        y: 123
      }
    })
  })

  it('should convert and return string representation of the object', function() {
    expect(a.toString()).to.eql('{\n  "x": {\n    "y": 123\n  }\n}')
  })

  it('should include $val fields if second argument is true', function() {
    expect(a.toString(false, true)).to.eql('{\n  "x": {\n    "y": {\n      "$val": 123\n    }\n  }\n}')
  })



  it('should exclude some properties when passed custom exclude', function() {
    var result = a.toString(function(key) {
      return key === 'y';
    })

    //this exclude brings properties beginning with '$'
    expect(result).to.eql('{\n  "$key": "a",\n  "x": {\n    "$key": "x"\n  }\n}')
  })

})
