'use strict'

describe('type', () => {
  describe('string', function () {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      inject: require('../../../../lib/operator/type'),
      $type: 'string'
    })

    it('should convert false to empty string', () => {
      obs.val = false
      expect(obs.val).to.equal('')
    })

    it('should convert 0 to "0"', () => {
      obs.val = 0
      expect(obs.val).to.equal('0')
    })

    it('should convert empty observable to empty string', () => {
      obs.val = new Observable()
      expect(obs.val).to.equal('')
    })

    it('should convert buffer to string', () => {
      obs.val = new Buffer('etc')
      expect(obs.val).equals('etc')
      // expect(obs.val)
    })
  })

  describe('buffer', function () {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      inject: require('../../../../lib/operator/type'),
      $type: 'buffer'
    })

    it('should convert empty observalbe to false', () => {
      expect(obs.val).to.equal(false)
    })

    it('should return buffer if buffer', () => {
      var buffer = new Buffer('something')
      obs.val = buffer
      expect(obs.val).to.equal(buffer)
    })

    it('should convert string to buffer', () => {
      obs.val = 'hello'
      expect(obs.val).instanceof(Buffer)
    })

    it('should convert number to buffer', () => {
      obs.val = 10
      expect(obs.val).instanceof(Buffer)
    })

    it('should convert boolean to buffer', () => {
      obs.val = true
      expect(obs.val).instanceof(Buffer)
    })
  })

  describe('boolean', function () {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      // want to test switching as well, no beforeEach
      inject: require('../../../../lib/operator/type'),
      $type: 'boolean'
    })

    it('should cast string to true', () => {
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

    it('true should be converted by true', () => {
      obs.val = true
      expect(obs.val).to.equal(true)
    })

    it('empty string should be converted to false', () => {
      obs.val = ''
      expect(obs.val).to.equal(false)
    })

    it('zero should be converted to false', () => {
      obs.val = 0
      expect(obs.val).to.equal(false)
    })
  })

  describe('url', function () {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      inject: require('../../../../lib/operator/type'),
      $type: 'url'
    })

    it('should cast "hello" to false', () => {
      obs.val = 'hello'
      expect(obs.val).to.equal(false)
    })

    it('should pass valid urls', () => {
      var url = [
        'https://github.com/sightmachine/SimpleCV/wiki/List-of-IP-Camera-Stream-URLs',
        'bla.com',
        'http://www.xxx.com',
        'https://bla.com/hey?222',
        'www.xxx.xxx.bla' // maybe add http?
      ]
      for (let i in url) {
        obs.val = url[i]
        expect(obs.val).ok
      }
    })

    it('should cast empty observable to false', () => {
      obs.val = new Observable()
      expect(obs.val).to.equal(false)
    })
  })

  describe('email', function () {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      inject: require('../../../../lib/operator/type'),
      $type: 'email'
    })

    it('should cast "hello" to false', () => {
      obs.val = 'hello'
      expect(obs.val).to.equal(false)
    })

    it('should pass valid urls', () => {
      var email = [
        'jan@vigour.io',
        'jan+1@vigour.io',
        'hello@1234.com',
        'somethingweird_ok@blabla.amsterdam'
      ]
      for (let i in email) {
        obs.val = email[i]
        expect(obs.val).ok
      }
    })

    it('should cast empty observable to false', () => {
      obs.val = new Observable()
      expect(obs.val).to.equal(false)
    })
  })

  describe('number', function () {
    var Observable = require('../../../../lib/observable/')
    var obs = new Observable({
      inject: require('../../../../lib/operator/type'),
      $type: 'number'
    })

    it('should cast string to 0', () => {
      obs.val = 'hello'
      expect(obs.val).to.equal(0)
    })

    it('should cast "200" to 200', () => {
      obs.val = '200'
      expect(obs.val).to.equal(200)
    })

    it('should cast "hello 200!" to 200', () => {
      obs.val = '200'
      expect(obs.val).to.equal(200)
    })

    it('should cast "hello 200.20!" to 200.20', () => {
      obs.val = '200.20'
      expect(obs.val).to.equal(200.20)
    })

    it('should cast empty observable to 0', () => {
      obs.val = new Observable()
      expect(obs.val).to.equal(0)
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
