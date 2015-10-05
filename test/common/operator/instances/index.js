'use strict'

describe('instances', function () {
  var Observable = require('../../../../lib/observable/')
  it('updates instances', function() {
    //make a bubble option
    var a = new Observable({
      inject: require('../../../../lib/operator/all'),
      val: 'y',
      key: 'a',
      $add: 'xxx',
      on: {
        data: function() {
          console.log('--->', this.val, this.path)
        }
      }
    })

    var b = new a.Constructor({
      key: 'b'
    })

    var c = new b.Constructor({
      key: 'c'
    })

    a.val = 200

  })
})
