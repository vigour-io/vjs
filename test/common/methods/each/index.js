var each = require('../../../../lib/methods/each').$define.each;

describe('each', function() {

  describe('array', function() {
    var arr;

    beforeEach(function() {
      arr = [40, 30, 50, 100];
    })

    it('should iterate for an array', function() {
      var count = 0;
      var total = 0;

      each.call(arr, function(val, index, self) {
        count++;
        total += val;
      })

      expect(count).to.be.equal(4)
      expect(total).to.be.equal(220)
    })

    it('should allow pass exclude Function', function() {
      var count = 0

      var exclude = function (val, index) {
        if (val === 40) {
          return true
        }
      }

      var excludeSpy = sinon.spy(exclude)

      each.call(arr, function() {
        count++
      }, excludeSpy)

      expect(count).to.equal(3)
      expect(excludeSpy).to.have.callCount(4)
    })

    it('should return and cancel the iteration', function() {
      var count = 0

      var result = each.call(arr, function(val, index, self) {
        count++
        if (val === 30) {
          return 'rahh'
        }
      })

      expect(result).to.equal('rahh')
      expect(count).to.equal(2)
    })

  })


  describe('object', function() {
    var obj;

    beforeEach(function() {
      obj = {
        name: 'rahh',
        age: 26,
        $key: 'obj',
        _$parent: 'not iterable'
      }
    })

    it('should iterate in an object', function() {
      var count = 0;
      var name, objRef

      each.call(obj, function(val, key, self) {
        objRef = self
        count++
        if (key === 'name') { name = val }
      });

      expect(count).to.be.equal(2)
      expect(name).to.be.equal('rahh')
      expect(objRef).to.be.eql(obj)
    })

    it('should allow pass exclude Function', function() {
      var count = 0

      var exclude = function (val, key) {
        if (key === 'age') {
          return true
        }
      }

      var excludeSpy = sinon.spy(exclude)

      each.call(obj, function() {
        count++
      }, excludeSpy)

      expect(count).to.equal(1)
      expect(excludeSpy).to.have.callCount(2)
    })

    it('should allow pass exclude string', function() {
      var count = 0

      each.call(obj, function() {
        count++
      }, 'age')

      expect(count).to.equal(1)
    })

    it('should return and cancel the iteration', function() {
      var count = 0

      var age = each.call(obj, function(val, key) {
        count++;
        if (key === 'age') {
          return val
        }
      })

      expect(age).to.equal(26)
      expect(count).to.equal(2)
    })

  })

})
