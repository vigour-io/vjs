var each = require('../../../../lib/methods/each').define.each

describe('each', function () {
  describe('array like', function () {
    var arr

    beforeEach(function () {
      arr = [40, 30, 50, 100]
    })

    it('should iterate for an array like object', function () {
      var count = 0
      var total = 0
      each.call(arr, function (val, index, self) {
        count++
        total += val
      })
      expect(count).to.be.equal(4)
      expect(total).to.be.equal(220)
    })

    it('should allow pass filter function', function () {
      var count = 0
      var filter = function (val, index) {
        return val !== 40
      }
      var filterSpy = sinon.spy(filter)
      each.call(arr, function () {
        count++
      }, filterSpy)
      expect(count).to.equal(3)
      expect(filterSpy).to.have.callCount(4)
    })

    it('should return and cancel the iteration', function () {
      var count = 0
      each.call(arr, function (val, index, self) {
        count++
        if (val === 30) {
          return 'rahh'
        }
      })
      expect(count).to.equal(2)
    })
  })

  describe('object', function () {
    var obj

    beforeEach(function () {
      obj = {
        name: 'rahh',
        age: 26,
        _parent: 'not iterable',
        nulled: null
      }
    })

    it('should iterate in an object', function () {
      var count = 0
      var name, objRef
      each.call(obj, function (val, key, self) {
        objRef = self
        count++
        if (key === 'name') {
          name = val
        }
      })
      expect(count).to.be.equal(2)
      expect(name).to.be.equal('rahh')
      expect(objRef).to.be.eql(obj)
    })

    it('should allow pass filter function', function () {
      var count = 0
      var filter = function (val, key) {
        return key !== 'age'
      }
      var filterSpy = sinon.spy(filter)
      each.call(obj, function () {
        count++
      }, filterSpy)
      expect(count).to.equal(1)
      expect(filterSpy).to.have.callCount(2)
    })

    it('should return and cancel the iteration', function () {
      var count = 0
      each.call(obj, function (val, key) {
        count++
        if (key === 'age') {
          return val
        }
      })
      expect(count).to.equal(2)
    })
  })

  describe('base', function () {
    var Base = require('../../../../lib/base')
    var a = new Base({
      key: 20,
      hello: {
        doit: true,
        dont: true
      },
      properties: {
        gurk: true
      },
      gurk: 200,
      _aField: true
    })
    var count

    beforeEach(function () {
      count = 0
    })

    it('should filter gurk, key and _aField', function () {
      a.each(function () {
        count++
      })
      expect(count).equals(1)
    })

    it('added empty fitler function should filter gurk, _aField', function () {
      a.each(function () {
        count++
      }, function () {
        return true
      })
      expect(count).equals(3)
    })

    it('added filter function should filter gurk, key and _aField', function () {
      a.each(function () {
        count++
      }, function (property, key, target) {
        var properties = target._properties
        return !properties[key]
      })
      expect(count).equals(1)
    })

    it('each has to filter parent for deeper field', function () {
      a.hello.each(function () {
        count++
      }, function (property, key, target) {
        var properties = target._properties
        return !properties[key]
      })
      expect(count).equals(2)
    })
  })
})
