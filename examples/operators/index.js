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
a.set({ $add: 10 })
console.log('ok ok', a, a.val)
