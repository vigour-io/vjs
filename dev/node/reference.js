"use strict";

var VPATH = '../../'

var Base = require( VPATH + 'lib/base' )
var perf = require( VPATH + 'lib/util/perf')


module.exports = function(repl, args){
  
  var ding1 = new Base({
    ding: 1
  })

  var ding2 = new Base({
    ref: ding1
  })

  console.log(ding2.$toString())
  
}

