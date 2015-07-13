var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

var Event = require('../../lib/base/on/event')

var Krek1 = function() {

}

define(Krek1.prototype, 'wext', {
  value: function() {
    return 1 + 1
  }
})

var Krek2 = require('./krek')




n = 5000


var k1 = new Krek1()
perf({
  log: console.log.bind(console),
  name: 'krek1',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      k1.wext()
    }
  },
  // loop: 12
})

var k2 = new Krek2()
perf({
  log: console.log.bind(console),
  name: 'krek2',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      k2.wext()
    }
  },
  // loop: 12
})


