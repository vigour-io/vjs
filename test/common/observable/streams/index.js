'use strict'
var Observable = require('../../../../lib/observable/')
var stream = require('stream')

describe('streams', function () {
  this.timeout(15000)
  xit('can consume a stream', function (done) {
    var readable = new stream.Readable({
      objectMode: true,
      read () {}
    })
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          if (data === 'hey') {
            done()
          }
        }
      }
    })
    a.val = readable
    readable.push('hey')
  })

  xit('can be piped from', function (done) {
    var a = new Observable({
      key: 'a'
    })
    var writable = new stream.Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        expect(chunk.toString()).to.equal('hey')
        done()
      }
    })
    a.pipe(writable)
    a.val = 'hey'
  })

  xit('can be piped to', function (done) {
    var readable = new stream.Readable({
      objectMode: true,
      read () {}
    })
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          if (data === 'hey') {
            done()
          }
        }
      }
    })
    readable.pipe(a.stream)
    readable.push('hey')
  })
})
