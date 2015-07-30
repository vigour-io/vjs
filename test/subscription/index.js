describe('subscription', function() {

  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')

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
          $change: {
            fafafa: {
              $val: function() {
                console.log('subscription triggered!')
              },
              $pattern: {
                key1: true
              },
              $subscriber: watcher
            }
          }
        }
      })

      obs.subscribe({ // generates key
        key1: true
      }, function(){
        console.log('another subscription triggered!')
      })

      console.log('subscriptions are stored in obs.$subscriptions', obs.$subscriptions)



    }
  )

})
