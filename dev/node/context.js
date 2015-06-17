"use strict";

var VPATH = '../../'

var Base = require( VPATH + 'lib/base' )
var perf = require( VPATH + 'lib/util/perf')


module.exports = function(repl, args){
  var n = 1e4
  perf({
    log: console.log.bind(console),
    name: 'context stuff tester',
    method: function(){
      for(var i = 0 ; i < n ; i++) {
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
}

