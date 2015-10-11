// require('./regen.js')

console.log('hey!')

var Base = require('../../../lib/base')

var a = new Base({
  inject: require('../../../lib/base/iterator'),
  x: true,
  y: true
})

for(var i of a) {
  console.log(i)
}
