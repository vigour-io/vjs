"use strict";

var VPATH = '../../'

var Base = require( VPATH + 'lib/base' )
var perf = require( VPATH + 'lib/dev/perf')

var helpers = require(VPATH + 'lib/base/util/helpers')

module.exports = function(repl, args){
  
  var ding1 = new Base({
    path: {
      naar: {
        iets: 1
      }
    },
    $add: {
      addthiskey: 'addthisvalue'
    }
  })

  var got = ding1.$val

  console.log('==========================')
  console.log('got dat', got)
  console.log('==========================')
  
}
