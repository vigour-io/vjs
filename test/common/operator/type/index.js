'use strict'

describe('type', () => {
  describe('string', function () {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      inject: require('../../../../lib/operator/type'),
      $type: 'string'
    })

    it('should cast false to empty string', () => {
      obs.val = false
      expect(obs.val).to.equal('')
    })

    it('should cast 0 to "0"', () => {
      obs.val = 0
      expect(obs.val).to.equal('0')
    })

    it('should cast empty observable to empty string', () => {
      obs.val = new Observable()
      expect(obs.val).to.equal('')
    })
  })

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

    it('should cast 0 to false', () => {
      obs.val = 0
      expect(obs.val).to.equal(false)
    })

    it('should cast empty observable to false', () => {
      obs.val = new Observable()
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
