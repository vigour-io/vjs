var Observable = require('../../lib/observable/')
Observable.prototype.inject(require('../../lib/operator/inject'))

var reffed = new Observable({
  key: 'reffed',
  val: 10
})


var reffed2 = new Observable({
  key: 'reffed2',
  val: reffed,
  $add:'murder'
})

var a = new Observable({
  key: 'a',
  val: reffed2,
  trackInstances: true,
  $add:'weed',
  on: {
    data: function (data) {
      console.log('fires', data, this.path, this.val)
    }
  }
})


console.log('a', a.val)


reffed.val = 20

reffed.val = 30

a.val = 'my own '
