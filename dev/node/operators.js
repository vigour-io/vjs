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
      addthiskey: 'addthisvalue',
      alsoaddthis: 'alsoaddedthis'
    },
    $map: function(key) {
      console.log('map called for', key)
      var setobj = {}
      setobj[key] = 'ha mapped this!' + Math.random()
      return setobj
    }
  })

  var got = ding1.$val

  console.log('==========================')
  console.log('got dat', got.$toString())
  console.log('==========================')
  
}
