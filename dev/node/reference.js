"use strict";

var VPATH = '../../'

var Base = require( VPATH + 'lib/base' )
var perf = require( VPATH + 'lib/util/perf')


module.exports = function(repl, args){
  
  var ding1 = new Base({
    path: {
      naar: {
        iets: 1
      }
    }
  })

  ding1._$name = 'ding1'

  var ding2 = new Base({
    primitive: 1,
    obj: {
      subprim: 2
    },
    ref: ding1.path.naar.iets
  })
  
  console.log('==========================')
  console.log(ding2.$toString())
  console.log('==========================')
  
}
