"use strict";

var VPATH = '../../'

var Base = require( VPATH + 'lib/base' )
var perf = require( VPATH + 'lib/util/perf')

var G = global

module.exports = function(repl, args){
  console.log('TEST GETTERS! got args', args)

  G.total = Number(args[1])

  Object.defineProperty( G, 's' , {
    get: function(){
      G.running = !G.running
    }
  })

  G.ran = 0
  G.n = 1e4
  G.run = run

  if(G.total)
    G.running = true

  var d1 = G.d1 = new Base({
    k1: '1111',
    k2: {
      k2_1: '2222'
    },
    k3: {
      k3_1: {
        k3_1_1: '3333'
      }
    }
  })
  d1._$key = 'd1'

  var d2 = G.d2 = new d1.$Constructor({
    k1: '1x',
    k2: {
      k2_1: '2x'
    },
    spesh: true
  })
  d2._$key = 'd2'

  if(G.running)
    run()

}



function run() {
  G.ran++
  console.log('------------------------- run', G.ran, '/', G.total)
  perf({
    log: console.log.bind(console),
    name: 'context stuff tester',
    method: function(){
      for(var i = 0 ; i < G.n ; i++) {
        var got = G.d2.k1
        got = G.d2.k2
        got = G.d2.k2.k2_1
        got = G.d2.k3
        got = G.d2.k3.k3_1
        got = G.d2.k3.k3_1.k3_1_1
      }
    },
    loop: 12
  })

  setTimeout(function(){
    if(G.running && G.ran < G.total){
      run()
    } else {
      console.log('------------------------- done!')
    }
  }, 500)

}