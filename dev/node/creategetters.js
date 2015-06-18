"use strict";

var VPATH = '../../'

var Base = require( VPATH + 'lib/base' )
var perf = require( VPATH + 'lib/util/perf')


module.exports = function(repl, args){
  console.log('got args', args)

  var context = repl.context

  context.total = Number(args[1])

  Object.defineProperty( context, 's' , {
    get: function(){
      context.running = !context.running
    }
  })
  context.ran = 0
  context.n = 1e4
  context.run = run
  context.running = true
  run(context)

}



function run(context) {
  context.ran++
  perf({
    log: console.log.bind(console),
    name: 'context stuff tester',
    method: function(){
      for(var i = 0 ; i < context.n ; i++) {
        var thing = new Base({
          change: false
        })
        thing = new thing.$Constructor({
          change: true
        })
      }
    },
    loop: 12
  })

  setTimeout(function(){
    if(context.running && context.ran < context.total)
      run(context)
  }, 500)

}