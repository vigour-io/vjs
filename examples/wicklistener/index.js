var define = Object.defineProperty

console.clear()

var Observable = require('../../lib/observable')

var purk = new Observable({
  key1: 'value1'
})

purk.on(function() {
  console.error('change on purk')
})

purk.key1.on('$change', function(){
  console.error('JA')
})

console.log('\n\nlisteners firen:')
console.log('---> knal die boi')
purk.key1.$val = 'shine'
console.log('<--- die boi is geknalt')


console.error('\n\nlisteners firen niet:')


console.error('---> knal die boi!')
purk.set({
  key1: 'no shine'
})
console.error('<--- die boi is geknalt')
