var http = require('http')
var Observable = require('../../../../lib/observable/')
var stream = require('stream')

describe('streams', function () {
  this.timeout(15000)
  it('can consume a stream', function (done) {
    var readable = new stream.Readable({
      objectMode: true
    })
    readable._read = function () {}
    var a = new Observable({
      key: 'a',
      on: {
        data: function (data) {
          if (data === 'hey') {
            done()
          }
        }
      }
    })
    a.val = readable
    readable.push('hey')
  })

  it('can be piped from', function (done) {
    var a = new Observable({
      key: 'a'
    })
    var writable = new stream.Writable({
      objectMode: true
    })
    writable._write = function (chunk, encoding, callback) {
      expect(chunk.toString()).to.equal('hey')
      done()
    }
    a.pipe(writable)
    a.val = 'hey'
  })

  xit('can be piped to', function (done) {
    // make this test better later... needs node server
    var a = new Observable({
      key: 'a',
      on: {
        data: function () {}
      }
    })
    var largeFile = http.request({
      hostname: 'localhost',
      path: '',
      method: 'GET',
      port: 3030
    }, function (res) {
      res.on('data', function (chunk) {})
      res.pipe(a.stream)
      res.on('end', done)
    })
    largeFile.end()
  })
})
