console.clear()

var Observable = require('../../../../lib/observable/')

var data = { gurkdata: true },
    Readable = require('stream').Readable,
    util = require('util')

var ReadStream = function() {
  Readable.call(this, {objectMode: true});
  this.data = data;
  this.curIndex = 0;
}

var fs = require('fs')

util.inherits(ReadStream, Readable);

describe('stream as input on observable', function() {

  console.error('hey stream!')
  it('should detect stream as input', function(done) {

    var a = new Observable({
      $key:'a',
      $val: fs.createReadStream('./bunxdles/_test_common_all_dev.js'),
      $on: {
        $change:function( event, chunk) {
          this.$output = chunk.toString()//this.$output ? this.$output+chunk : chunk
          // console.error('hey change!', chunk)
        },
        // $end:function( event ) {
        //   // console.error('hey end!', this.$val.toString())
        //   // done()
        // },
        $error:function( event, error ) {
          console.error( '\n\n\noops!', error )
        }
      },
      $inject: [
        require('../../../../lib/operator/add'),
        require('../../../../lib/operator/transform')
      ],
      $add: function() {
        return this.$output
      },
      $transform: function( val ) {
        return val.length*2
      }
    })

    //for end maybe just add meta infos?

    var b = new Observable({
      $key:'b',
      $val: a
    })

    var c = new Observable({
      $key:'c',
      $val: b
    })

    c.on('$change', function() {
      this.$output = this.$output ? this.$output+this.$input : this.$input
      console.log('--->', this.$val)
    })

    // console.log(c.$val)


  })

})
