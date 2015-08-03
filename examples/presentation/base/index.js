var Base = require('../../../lib/base')
var Observable = require('../../../lib/observable')

var a = new Observable({
  $key:'a',
  a:true,
  b:true,
  c:{
    a: {
      b: {
        $on: {
          $change: function( event, meta ) {
            console.log(' i am firing a listener!', this.$path)
          }
        },
        c: {
          d:true
        }
      }
    }
  }
})

console.log(a)

var b = new a.$Constructor({
  $key:'b'
})

a.c.a.b.$val = 'blabla'

b.c.a.b.$val = 'xxx'