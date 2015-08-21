var Emitter = require('../../../lib/emitter/')

describe('emitter', function() {
  console.clear()
  var a = new Emitter()
  console.log(a)
  
  a.on(function(){
    console.log('heyheyhey')
  })



})
