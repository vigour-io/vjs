'use strict'

describe('type', () => {
  describe('boolean', function () {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      inject: require('../../../../lib/operator/type'),
      $type: 'boolean'
    })

    it('should cast to true', () => {
      obs.val = 'hello'
      expect(obs.val).to.equal(true)
    })

    it('should cast to false', () => {
      obs.val = 0
      expect(obs.val).to.equal(false)
    })
  })

  describe('range', () => {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      inject: require('../../../../lib/operator/type'),
      $type: { range: [0, 1] }
    })

    it('should cast to range', () => {
      obs.val = '0.4'
      expect(obs.val).equals(0.4)
    })

    it('should return min range', () => {
      obs.val = 'rahh'
      expect(obs.val).equals(0)
    })

    it('should return max range', () => {
      obs.val = 100
      expect(obs.val).equals(1)
    })

    it('can change range', () => {
      obs.$type.set({ range: [10, 100] })
    })

    it('should return min', () => {
      obs.val = 1
      expect(obs.val).equals(10)
    })
    it('should return max', () => {
      obs.val = 150
      expect(obs.val).equals(100)
    })
  })
})
