describe('subscription', function() {

  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')
  


  it('basic meta listener test', function(){

    var MetaEmitter = require('../../lib/observable/on/metaemitter')

    var subsEmitter = new MetaEmitter({
      hopla: function() {
        console.log('SUBSEMITTER HANDLER FIRED!')
      },
      $pattern: {

      }
    })

    var ding1 = new Observable({
      $on: {
        $change: function(event) {
          console.log('hahue change is fired lol')
          if(!subsEmitter._$meta) {
            subsEmitter._$meta = {}
          }
          subsEmitter._$meta.changert = true
          console.log('durks?', subsEmitter.$emit.toString())
          subsEmitter.$emit(event)
        },
        durps: subsEmitter
      }
    })

    console.log('\n\n-------------- go fire dat boy')

    ding1.$val = 'hupla!'



  })


  it( 'create watcher that subscribes to a property of obs',
    function() {

      var watcher = new Observable({
        $on:{
          $change: function() {
            console.log('I am firing because I\'m watching obs!')
          }
        }
      })

      var obs = new Observable({
        key1: 'value1',
        $subscriptions: {
          flapflap: {
            fafafa: fn,
            bla: [fn, Base],
            kurkn: Base,
            $pattern: {
              
            }
          },
        }
      })


      // bla.$subscriptions[blakey] [ fn > obs.$change.emit(), obs ]

      // emitter per subscription object / pattern

      // unique key in $subscription for each pattern




      // obs.subscribe({ // generates key
      //   key1: true
      // }, function(){
      //   console.log('another subscription triggered!')
      // })

      // console.log('subscriptions are stored in obs.$subscriptions', obs.$subscriptions)



    }
  )

})
