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
  val: 10,
  $add: function (value) {
    if (value > 10) {
      return 20
    } else {
      return -20
    }
  }
})

var b = new Observable({
  val: a,
  $add: c,
  // support on fn (fn will be on data)
  on: {
    data: function (data) {
      console.error('fire it fire it!', data, this.val)
    }
  }
})

console.log('b val', b.val)

c.val = 100
