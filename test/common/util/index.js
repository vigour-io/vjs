describe('util', function () {
  var Base = require('../../../lib/base')
  var isPlainObj = require('../../../lib/util/is/plainobj')
  var isNumber = require('../../../lib/util/is/number')
  var isEmpty = require('../../../lib/util/is/empty')
  var isNumberLike = require('../../../lib/util/is/numberlike')
  var isRemoved = require('../../../lib/util/is/removed')

  describe('isNumber', function () {
    it('should check if parameter is a number and return a boolean value', function () {
      expect(isNumber(2)).to.be.ok
      expect(isNumber(-10)).to.be.ok
      expect(isNumber('2')).to.not.be.ok
      expect(isNumber('two')).to.not.be.ok
    })
  })

  describe('isNumberLike', function () {
    it('should check if parameter is like a number ("2", "-10") and return a boolean value', function () {
      expect(isNumberLike(2)).to.be.ok
      expect(isNumberLike(-10)).to.be.ok
      expect(isNumberLike('2')).to.be.ok
      expect(isNumberLike('two')).to.not.be.ok
    })
  })

  describe('isPlainObj', function () {
    it('should check if parameter is a plain object and return a boolean value', function () {
      expect(isPlainObj({})).to.be.true
      expect(isPlainObj({x: 1})).to.be.true
      expect(isPlainObj([])).to.be.true
      expect(isPlainObj('two')).to.not.be.true
    })
  })

  describe('isEmpty', function () {
    it('should check if object is empty and return a boolean value', function () {
      expect(isEmpty({})).be.true
      expect(isEmpty({a: 1})).not.be.true
    })

    it('should exclude properties in base', function () {
      var a = new Base({ key: 'a' })
      expect(isEmpty(a)).be.true
    })
  })
  // Jim can we check this test??
  describe('isRemoved', function () {
    it('should check if an observable is remove', function () {
      var a = new Base()
      a.remove()
      isRemoved
    })
  })

  require('./flatten')
  require('./unflatten')
  require('./safelySet')
})
