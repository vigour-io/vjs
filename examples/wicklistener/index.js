var define = Object.defineProperty

var Observable = require('../../lib/observable')

var purk = new Observable({
  key1: 'value1'
})

purk.key1.on('$change', function(){
  console.error('JA')
})

console.log('---> knal die boi')
// purk.key1.$val = 'shine'
purk.set({
  key1: 'no shine'
})
console.log('<--- die boi is geknalt')
