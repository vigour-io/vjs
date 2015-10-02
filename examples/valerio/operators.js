var Base = require('../../lib/base')
Base.prototype.inject(require('../../lib/operator/inject'))

var isRemoved = require('../../lib/util').isRemoved

var a = new Base({
  val: 20
})

var c = new Base({
  val: 10,
  $add: function (value) {
    if (value > 10) {
      return 20
    } else {
      return -20
    }
  }
})

var b = new Base({
  val: a,
  $add: c
})

b.remove()
console.log(isRemoved(b))
//by default it creates a new base obj for property x with val === 10
//but if I want to override the key name of that base object and not its value?
//why it doesn't create a base object with key '$x'??
console.log(b.val)
