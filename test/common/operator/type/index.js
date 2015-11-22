'use strict'

var Observable = require('../../../../lib/observable/')

describe('test operator type', () => {
  var a
  var RANGES = [0, 1]

  beforeEach(() => {
    var properties = {
      play: {
        $type: 'boolean'
      },
      time: {
        $type: { range: RANGES }
      }
    }

    a = new Observable({
      ChildConstructor: new Observable({
        inject: require('../../../../lib/operator/type')
      }),
      inject: properties
    })
  })

  describe('boolean', () => {
    beforeEach(() => {
      a.play.val = 'a'
    })

    it('should allow type boolean', () => {
      expect(typeof a.play.val).equals('boolean')
    })

    it('should be true', () => {
      expect(a.play.val).equals(true)
    })

    describe('when falsy value', () => {
      beforeEach(() => {
        a.play.val = 0
      })

      it('should allow type boolean', () => {
        expect(typeof a.play.val).equals('boolean')
      })

      it('should be true', () => {
        expect(a.play.val).equals(false)
      })
    })
  })

  describe('range', () => {
    it('should allow range type', () => {
      a.time.val = '0.4'

      expect(a.time.val).equals(0.4)
    })

    it('should return min range', () => {
      a.time.val = 'rahh'

      expect(a.time.val).equals(RANGES[0])
    })

    it('should return max range', () => {
      a.time.val = 100

      expect(a.time.val).equals(RANGES[1])
    })

    describe('get mim or max depending on the approximity', () => {
      var newRanges = [10, 100]

      beforeEach(() => {
        a.set({
          anotherTime: {
            $type: { range: newRanges }
          }
        })
      })

      it('should return min', () => {
        a.anotherTime.val = 1
        expect(a.anotherTime.val).equals(newRanges[0])
      })

      it('should return max', () => {
        a.anotherTime.val = 150
        expect(a.anotherTime.val).equals(newRanges[1])
      })
    })
  })
})
