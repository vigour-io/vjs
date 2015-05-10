var vObj = require('vjs-object')

var a = new vObj() //constructor always the same as a set???

//$define is just a normal wrapped defineProperty , w some added convience also has flavourize
a.$define({
  myboo: {
  	value:'mybooboo'
  }
})

a.bla = true

for(var key$ in a) {
  console.log(key$)
}

console.log( 'hey!', a )

