var Observable = require('../../../lib/observable')
var Config = require('../../../lib/config')
var Api = require('../../../lib/api')
var ISNODE = require('../../../lib/util/isnode')

// console.clear()

describe('Api', function(){

  it('get a result from operator', function( done ) {

    var timeApi = new Api({
      time: {
        $on: {
          $change: function(event) {
            this.$parent.emit('$change', event)
          }
        }
      },
      $on: {
        $change: {
          //defer is not good yet
          $defer: function( emit, event, defer ) {
            var t = this
            if(!(this.time.$val > 0)) {
              // console.log('time?', this.time.$val)
              return true
            }
            setTimeout(function() {
              t.set({
                $apiResult: {
                  aValue: ~~(Math.random()*9999)
                }
              }, event)
              emit()
            }, this.time.$val )
          }
        }
      }
    })

    timeApi.on('$change', function() {
      done()
    })

    // console.log('----------')
    timeApi.time.$val = 20

  })
})
