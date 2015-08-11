var Base = require('../../../../lib/base/');
var Filter = require('../../../../lib/methods/filter');

Base.prototype.inject(Filter)

describe('filter', function() {

  it('should filter Array', function() {
    var filter = Filter.$define.filter;

    var result = filter.call([3,2,23,10,50], function(item) {
      return item % 2 === 0
    })

    expect(result).to.have.length(3)
  })

  describe('object', function() {
    var a

    beforeEach(function() {
      a = new Base({
        $key: 'a',
        z: 123,
        x: {
          ab: 456,
          aa: 789,
        }
      })
    })

    it('should filter values of Base nested properties', function() {
      var result = a.filter(123)

      expect(result).to.have.length(1)
      expect(result[0]).to.be.eql(a.z)
    })

    it('should be possible to pass an array of matching elements', function() {
      var result = a.x.filter([456, 789])

      expect(result).to.have.length(2)
      expect(result[0]).to.eql(a.x.ab)
      expect(result[1]).to.eql(a.x.aa)
    })

  })

})
