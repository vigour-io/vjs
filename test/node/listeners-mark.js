
console.log('\n\n\n')

var VObject = require('../../object')

var mark = new VObject({mark:'mark'})

var otherthing = new VObject({otherthing:'otherthing'})

function listener(){
  console.log('burklistener')
  console.log('this', this)
}



otherthing.addListener([listener, mark],true)

console.log('xxxxxxxxxxxxxxxxxxxx first')
otherthing.set('first', 1)
console.log('xxxxxxxxxxxxxxxxxxxx remove')
console.log('listeners', otherthing._listeners)
mark.remove()
console.log('listeners', otherthing._listeners)
console.log('xxxxxxxxxxxxxxxxxxxx second')
otherthing.set('second', 2)