
console.log('\n\n\n')

var VObject = require('../../object')

var root = new VObject({original:{fe:{test:true}}})
  , original = root.original


var otherthing = new VObject({otherthing:'otherthing'})

console.log('----------------- doing dat set')

original.set('lurf', otherthing, false, true)