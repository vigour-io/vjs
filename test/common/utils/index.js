describe('util', function() {

  var Base = require('../../../lib/base')
  var util = require('../../../lib/util')

  describe('isNumber', function() {
    it('should check if parameter is a number and return a boolean value', function() {
      // must pass
      expect(util.isNumber(2)).to.be.ok
      expect(util.isNumber(-10)).to.be.ok

      // must fail
      expect(util.isNumber('2')).to.not.be.ok
      expect(util.isNumber('two')).to.not.be.ok
    })
  })

  describe('isLikeNumber', function() {
    it('should check if parameter is like a number ("2", "-10") and return a boolean value', function() {
      // must pass
      expect(util.isLikeNumber(2)).to.be.ok
      expect(util.isLikeNumber(-10)).to.be.ok
      expect(util.isLikeNumber('2')).to.be.ok

      // must fail
      expect(util.isLikeNumber('two')).to.not.be.ok
    })
  })

  describe('isPlainObj', function() {
    it('should check if parameter is a plain object and return a boolean value', function() {
      // must pass
      expect(util.isPlainObj({})).to.be.true
      expect(util.isPlainObj({x: 1})).to.be.true
      expect(util.isPlainObj([])).to.be.true

      // mast fail
      expect(util.isPlainObj('two')).to.not.be.true
    })
  })

  describe('convertToArray', function() {
    it('should convert an object into an array', function() {
      var testFunc = function(){
        return arguments
      }

      // must pass
      expect(
        Array.isArray(
          util.convertToArray(testFunc(1,2,3,4))
        )
      ).to.be.true

      // must fail
      expect(
        Array.isArray(
          testFunc(1,2,3,4)
        )
      ).to.not.be.true
    })
  })

  describe('isEmpty', function () {
    it('should check if object is empty and return a boolean value', function () {
      // must pass
      expect(
        util.isEmpty({})
      ).to.be.true

      // must fail
      expect(
        util.isEmpty({a: 1})
      ).to.not.be.true
    })
  })

  describe('isRemoved', function () {
    it('should check if an observable is remove', function() {
      var a = new Base()
      a.remove()
      util.isRemoved
    })
  })
})
