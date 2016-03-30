
console.log('\n\n\n')
var object = require('../../object')

var a = new object(111)

// var http = require('http')
// var server = http.createServer().listen(1212)


for(var i = 0 ; i < 10000000 ; i ++) {

  var g = Math.random()*99999
}

var x= new object()

a.addListener([function(){},x],true)

// console.log('??', a)

x.remove()

console.log('there still here',a._listeners)

// lol.wut()