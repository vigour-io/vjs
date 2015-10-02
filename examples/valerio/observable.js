var Observable = require('../../lib/observable/')

var a = new Observable({
  key: 'a',
  trackInstances: true,
  field: {
    on: {
      data: function(data) {
        console.log('fires', data, this.path)
      }
    }
  }
})


var b = new a.Constructor({
  key:'b'
})


var c = new b.Constructor({
  key:'c'
})

b.field.val = 'valerio'
// b.field.val = 'valerio'
b.field.emit('data', 'jim')
console.log('----', b.field.val)
// a.field.val = 'valerio'
