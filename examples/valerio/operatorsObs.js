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
  $add: a
})

var b = new Observable({
  key: 'b',
  val: a,
  $add: c,
  // $transform: 200,
  // support on fn (fn will be on data)
  on: {
    data: function (data, event) {
      console.error('fire it fire it!', data, this.val, event.origin.path)
    }
  }
})

c.val = 1000

a.val = 2000

var time = Date.now()

console.info('b val', b.val, window.cnt)


for (var i = 0; i < 100000; i++) {
  b.val
}

time = Date.now() - time

console.warn(time / 1000 + ' s', window.cnt)
console.error('-----------------')

var e = new Observable({
  properties: {
    bla: new Observable({
      on: {
        data: function (val) {
          console.error('ok data', val)
        }
      }
    })
  },
  bla: 20
})
