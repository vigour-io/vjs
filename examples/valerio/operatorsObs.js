var Observable = require('../../lib/observable')
Observable.prototype.inject(require('../../lib/operator/all'))

var a = new Observable({
  val: 40,
  on: {
    data: function (data) {
      console.warn(data)
    }
  }
})

var c = new Observable({
  key: 'c',
  val: 10,
  $add: function (value) {
    // operators have bind on default (may not be nessecary)
    // console.log(this.path)
    if (value > 10) {
      return 20
    } else {
      return -20
    }
  }
})

var b = new Observable({
  val: a,
  $add: 100,
  $transform: 200,
  // support on fn (fn will be on data)
  on: {
    data: function (data, event) {
      console.error('fire it fire it!', data, this.val, event.origin.path)
    }
  }
})

console.log('b val', b.val)

c.val = 1000

var time = Date.now()

for (var i = 0; i < 100000; i++) {
  b.val
}

time = Date.now() - time

console.warn(time/1000+' s')
