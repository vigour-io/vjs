var Operator = require('../../lib/operator')
console.log(Operator)
var bla = new Operator()
console.log('dd', bla)
  //make it work only with obs first?
  // why not...

var Cnstr = require('../../lib/base')
Cnstr.prototype.inject(require('../../lib/operator/inject'))

var a = new Cnstr({
  val: 1,
  $add: 2
})
console.log('ok ok', a, a.val)
a.set({
  $add: 10
})
console.log('ok ok', a, a.val)

var b = new Cnstr({
  val: 1,
  $add: {
    val: function () {
      return ' haha add'
    },
    order: 1
  },
  $transform: {
    val: function () {
      return 'blargh'
    },
    order: 0
  }
})

console.log(b.val)
