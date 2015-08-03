describe('utils', function() {

  var Base = require('../../lib/base')
  var utils = require('../../lib/util')

  describe('isNumber', function() {
    it('should check if parameter is a number and return a boolean value', function() {

      // must pass
      expect(utils.isNumber(2)).to.be.ok
      expect(utils.isNumber(-10)).to.be.ok

      // must fail
      expect(utils.isNumber('2')).to.not.be.ok
      expect(utils.isNumber('two')).to.not.be.ok

    })
  })

  describe('isLikeNumber', function() {
    it('should check if parameter is like a number ("2", "-10") and return a boolean value', function() {

      // must pass
      expect(utils.isLikeNumber(2)).to.be.ok
      expect(utils.isLikeNumber(-10)).to.be.ok
      expect(utils.isLikeNumber('2')).to.be.ok

      // must fail
      expect(utils.isLikeNumber('two')).to.not.be.ok

    })
  })

  describe('isPlainObj', function() {
    it('should check if parameter is a plain object and return a boolean value', function() {

      // must pass
      expect(utils.isPlainObj({})).to.be.true
      expect(utils.isPlainObj({x: 1})).to.be.true
      expect(utils.isPlainObj([])).to.be.true

      // mast fail
      expect(utils.isPlainObj('two')).to.not.be.true

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
          utils.convertToArray(testFunc(1,2,3,4))
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
        utils.isEmpty({})
      ).to.be.true

      // must fail
      expect(
        utils.isEmpty({a: 1})
      ).to.not.be.true

    })
  })

  describe('isRemoved', function () {
    it('should ...', function () {

      // ...

    })
  })
})