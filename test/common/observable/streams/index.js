var http = require('http')
var Observable = require('../../../../lib/observable/')
var stream = require('stream')
console.clear()

describe('streams', function() {
  this.timeout(15000)

  it('can consume a stream', function(done) {
    var readable = new stream.Readable({
      objectMode: true
    })
    readable._read = function(){}

    var a = new Observable({
      $key:'a',
      $on:{
        $change:function( event, meta ) {
          if(meta) {
            expect(meta).to.equal('hey')
            done()
          }
        }
      }
    })
    //maybe dont fire when setting to stream?
    a.$val = readable
    readable.push('hey')
  })

  it('can be piped from', function(done) {
    var a = new Observable({
      $key:'a'
    })
    var writable = new stream.Writable({
      objectMode: true
    })
    writable._write = function(chunk, encoding, callback) {
      expect(chunk.toString()).to.equal('hey')
      done()
    }
    a.pipe( writable )
    a.$val = 'hey'
  })

  it('can be piped to', function(done) {
    //make this test better later...
    var a = new Observable({
      $key:'a',
      $on: {
        $change: function(event, meta) {
      
        }
      }
    })
    var largeFile = http.request({
      hostname: 'localhost',
      path: '',
      method:'GET',
      port:3030
    }, function(res) {
      res.on('data', function(chunk) {
    
      })
      res.pipe( a.stream )
      res.on('end', done )
    })
    largeFile.end()
  })

})
