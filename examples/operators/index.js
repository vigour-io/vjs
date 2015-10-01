var Operator = require('../../lib/operator')
console.log(Operator)
var bla = new Operator()

console.log('dd', bla)

var Obs = require('../../lib/observable')
Obs.prototype.inject(require('../../lib/operator/inject'))

var a = new Obs({
 val:1,
 $add:2
})
console.log('ok ok', a, a.val )
